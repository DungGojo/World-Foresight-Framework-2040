# World Foresight Framework - Question Scoring Methodology

This document is the reference for the simplified scoring pipeline.

## 1. Purpose

After the modeling notebook creates `full_data_to_2040`, the scoring pipeline converts
selected proxy forecasts into comparable 0-100 scores so markets can be ranked for a
specific analyst-defined question.

For now, scoring uses only:

```text
scenario = main_scenario
```

Optimistic and pessimistic scenarios remain useful for forecast review, but they are not
used for the ranking output.

## 2. Input Data Contract

The scoring pipeline receives:

### 2a. Forecast Data

Usually this is `full_data_to_2040` filtered to future `main_scenario` rows.

Required columns:

| Column | Notes |
| --- | --- |
| `id` | Proxy code, e.g. `D1`. |
| `market` | ISO-3 market/country code. |
| `date` | Forecast year. |
| `value` | Forecast value on original scale. |
| `scenario` | Must include `main_scenario`. |

Other columns can exist and are ignored by the scorer.

### 2b. Proxy Scoring Config

One row per proxy included in a question:

```python
[
    {"id": "D1", "question": "Q1", "direction": "positive"},
    {"id": "D2", "question": "Q1", "direction": "negative"},
]
```

Fields:

| Field | Notes |
| --- | --- |
| `id` | Proxy id to score. |
| `question` | Question name/code, e.g. `Q1`. |
| `direction` | `positive` if higher is better; `negative` if higher is worse. |

All included proxies are equal-weighted. `weight` and `label` are intentionally removed
from the simplified config.

## 3. Standardization Formula

Each proxy is standardized across markets:

```text
z = (value - mean(values)) / stdev(values)
score = clamp((z + 2) / 4 * 100, 0, 100)
```

Meaning:

```text
z = -2 -> 0
z =  0 -> 50
z = +2 -> 100
```

If a proxy has no usable cross-market variance, all usable markets receive `50`.

## 4. Scoring Pipeline

### Step 1 - Filter

Filter to:

```text
date == target_year
scenario == main_scenario
id in proxy_scoring_config for the selected question
```

### Step 2 - Pivot

Create a wide table:

```text
rows = market
columns = proxy id
values = value
```

### Step 3 - Direction Adjustment

For each proxy:

```text
positive -> use value as-is
negative -> use -value
```

After this, higher adjusted value always means better.

### Step 4 - Standardize Per Proxy

Apply `standardize_to_100()` to each proxy across markets.

### Step 5 - Equal-Weight Average

Average the standardized proxy scores for each market, skipping missing proxy values.

### Step 6 - Re-Standardize Final Score

Apply `standardize_to_100()` again to the market-level average. This spreads the final
rankings after proxy averaging compresses the score range.

### Step 7 - Output

Return only the storytelling columns:

| Column | Notes |
| --- | --- |
| `market` | ISO-3 market/country code. |
| `question` | Question being scored. |
| `final_score` | Final 0-100 score. |
| `rank` | Rank where 1 is highest `final_score`. |

## 5. Functions

Implemented in `Code/Scoring/scoring.py`:

```python
standardize_to_100(values)
score_question(forecast_df, proxy_scoring_config, question, target_year=2040)
score_all_questions(forecast_df, proxy_scoring_config, target_year=2040)
```

## 6. Edge Cases

| Case | Behaviour |
| --- | --- |
| Same value for all markets | Assign `50` to all usable markets. |
| Only one market has data | Assign `50` to that usable market. |
| Missing proxy value for a market | Skip that proxy for that market's average. |
| Question not found in config | Raise `ValueError` listing available questions. |
| Proxy in config not found in forecast data | Warn and skip. |
| Invalid direction | Raise `ValueError`. |

## 7. Notebook

Use:

```text
Market Relevance.ipynb
```

The notebook assumes `full_data_to_2040` or the `Final Full Data` workbook sheet is
available, defines the question config, runs `score_question()`, and displays the final
market ranking.
