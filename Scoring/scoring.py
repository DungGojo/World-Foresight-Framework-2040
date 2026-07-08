"""
Question scoring functions.

The scoring pipeline converts forecast values into comparable 0-100 scores and
ranks markets for one analyst-defined question. It uses only main_scenario.
"""

import warnings

import numpy as np
import pandas as pd


MAIN_SCENARIO = "main_scenario"
REQUIRED_FORECAST_COLUMNS = {"id", "market", "date", "value", "scenario"}
REQUIRED_CONFIG_COLUMNS = {"id", "question", "direction"}
ALLOWED_DIRECTIONS = {"positive", "negative"}
OUTPUT_COLUMNS = ["market", "question", "final_score", "rank"]
EPS = 1e-9


def standardize_to_100(values: np.ndarray) -> np.ndarray:
    """
    Z-score normalize to [0, 100].

    NaN values are ignored when estimating mean/std and remain NaN in the
    output so missing proxy values can be skipped during aggregation.
    """
    arr = np.asarray(values, dtype=float)
    out = np.full(arr.shape, np.nan, dtype=float)
    valid = ~np.isnan(arr)
    if valid.sum() == 0:
        return out
    if valid.sum() < 2:
        out[valid] = 50.0
        return out

    mean = float(np.nanmean(arr))
    std = float(np.nanstd(arr, ddof=1))
    if std < EPS:
        out[valid] = 50.0
        return out

    z = (arr[valid] - mean) / std
    out[valid] = np.clip((z + 2) / 4 * 100, 0, 100)
    return out


def _prepare_config(proxy_scoring_config: list[dict] | pd.DataFrame) -> pd.DataFrame:
    cfg = pd.DataFrame(proxy_scoring_config).copy()
    missing_cols = REQUIRED_CONFIG_COLUMNS - set(cfg.columns)
    if missing_cols:
        raise ValueError(f"proxy_scoring_config is missing columns: {sorted(missing_cols)}")

    cfg = cfg[["id", "question", "direction"]].copy()
    cfg["id"] = cfg["id"].astype(str).str.strip()
    cfg["question"] = cfg["question"].astype(str).str.strip()
    cfg["direction"] = cfg["direction"].astype(str).str.lower().str.strip()

    invalid_direction = sorted(set(cfg["direction"]) - ALLOWED_DIRECTIONS)
    if invalid_direction:
        raise ValueError(
            "Invalid direction values. Expected 'positive' or 'negative'; "
            f"got {invalid_direction}."
        )
    if cfg["id"].duplicated().any():
        duplicated = sorted(cfg.loc[cfg["id"].duplicated(), "id"].unique())
        raise ValueError(f"Duplicate proxy ids in proxy_scoring_config: {duplicated}")
    return cfg


def _validate_forecast_df(forecast_df: pd.DataFrame) -> None:
    missing_cols = REQUIRED_FORECAST_COLUMNS - set(forecast_df.columns)
    if missing_cols:
        raise ValueError(f"forecast_df is missing columns: {sorted(missing_cols)}")


def score_question(
    forecast_df: pd.DataFrame,
    proxy_scoring_config: list[dict] | pd.DataFrame,
    question: str,
    target_year: int = 2040,
) -> pd.DataFrame:
    """
    Score one question using main_scenario only.

    Output columns are intentionally compact:
    market, question, final_score, rank.
    """
    _validate_forecast_df(forecast_df)
    cfg = _prepare_config(proxy_scoring_config)
    question = str(question).strip()

    available_questions = sorted(cfg["question"].dropna().unique())
    question_cfg = cfg[cfg["question"] == question].copy()
    if question_cfg.empty:
        raise ValueError(
            f"Question {question!r} was not found in proxy_scoring_config. "
            f"Available questions: {available_questions}"
        )

    year_df = forecast_df[
        (forecast_df["date"].astype(int) == int(target_year))
        & (forecast_df["scenario"].astype(str) == MAIN_SCENARIO)
    ].copy()
    if year_df.empty:
        raise ValueError(
            f"No forecast rows found for target_year={target_year}, scenario={MAIN_SCENARIO!r}."
        )

    requested_ids = question_cfg["id"].tolist()
    available_ids = sorted(set(year_df["id"].astype(str)) & set(requested_ids))
    missing_ids = sorted(set(requested_ids) - set(available_ids))
    if missing_ids:
        warnings.warn(
            f"Skipping proxies not found in forecast_df for {target_year}/{MAIN_SCENARIO}: {missing_ids}",
            stacklevel=2,
        )
    if not available_ids:
        raise ValueError(
            f"No configured proxies for question {question!r} were found in forecast_df."
        )

    question_cfg = question_cfg[question_cfg["id"].isin(available_ids)].copy()
    raw_wide = (
        year_df[year_df["id"].astype(str).isin(available_ids)]
        .pivot_table(index="market", columns="id", values="value", aggfunc="mean")
        .reindex(columns=available_ids)
        .sort_index()
    )

    config_by_id = question_cfg.drop_duplicates("id").set_index("id")
    score_wide = pd.DataFrame(index=raw_wide.index)
    for proxy_id in raw_wide.columns:
        values = raw_wide[proxy_id].to_numpy(dtype=float)
        if config_by_id.loc[proxy_id, "direction"] == "negative":
            values = -values
        score_wide[proxy_id] = standardize_to_100(values)

    aggregated_score = score_wide.mean(axis=1, skipna=True).to_numpy(dtype=float)
    final_score = standardize_to_100(aggregated_score)

    out = pd.DataFrame({
        "market": raw_wide.index,
        "question": question,
        "final_score": final_score,
    })
    out["rank"] = out["final_score"].rank(method="min", ascending=False, na_option="bottom")
    out["rank"] = out["rank"].astype(int)
    return out[OUTPUT_COLUMNS].sort_values(["rank", "market"]).reset_index(drop=True)


def score_all_questions(
    forecast_df: pd.DataFrame,
    proxy_scoring_config: list[dict] | pd.DataFrame,
    target_year: int = 2040,
) -> pd.DataFrame:
    """
    Score every question in proxy_scoring_config using main_scenario only.
    """
    cfg = _prepare_config(proxy_scoring_config)
    questions = sorted(cfg["question"].dropna().unique())
    if not questions:
        raise ValueError("proxy_scoring_config does not contain any questions.")
    results = [
        score_question(
            forecast_df,
            cfg,
            question,
            target_year=target_year,
        )
        for question in questions
    ]
    return pd.concat(results, ignore_index=True)
