# World Foresight Framework — Modeling Methodology

This document describes the current forecasting pipeline: what it does, why, and
how to review its output. The pipeline was simplified in July 2026 — a
two-layer machine-learning "stacking" ensemble was replaced with a single,
transparent damped-trend model. See Section 11 for what changed and why.

## 1. Core Idea

```text
raw value
  -> transformed y                      (put every proxy on a safe modelling scale)
  -> local trend / same-id pooled trend (trust local when strong; otherwise borrow same-id peers)
  -> credibility blend                  (short/noisy series lean on the pooled slope)
  -> damped projection                  (the trend fades out; the path flattens over time)
  -> guardrails                         (drift cap + sanity ceiling keep values realistic)
  -> inverse transform + cap
  -> main / optimistic / pessimistic scenarios + confidence intervals
```

The guiding principle: **carry the recent trend forward, fade it out over the
horizon, shrunk toward comparable same-id series, inside sanity limits.** This keeps
long-horizon (2040) forecasts realistic and every number explainable.

## 2. High-Level Pipeline

| Step | Purpose |
| --- | --- |
| Load workbook inputs | Read historical values and proxy modelling rules (type, bounds, shock policy). |
| Validate proxy config | Reject impossible transforms; drop proxies with fewer than 5 usable points. |
| Prepare modelling frame | Clean values, mark shock years, set sample weights, add transformed `y`. |
| Compute diagnostics | Trend, slope, volatility, shock sensitivity, uncertainty level per series. |
| Forecast | Damped blended-trend projection on the transformed scale (Section 6). Each series starts one year after its own latest historical observation. |
| Inverse transform + cap | Convert back to original units and apply proxy bounds. |
| Scenario + interval build | Produce main/optimistic/pessimistic values and confidence intervals. |
| Backtest | Rolling-origin multi-horizon accuracy check (Section 9). |

## 3. Proxy Types and Transform Logic

Transforms keep forecasts inside valid ranges. Allowed types: `BOUNDED`,
`SEM_BOUNDED`, `UNBOUNDED`. Allowed shock policies: `IGNORE`, `DOWNWEIGHT`.

### BOUNDED (both bounds, e.g. a 0–100 score)
```text
width  = upper - lower
scaled = (value - lower) / width
y      = log(scaled / (1 - scaled))            # logit
inverse: value = lower + width / (1 + exp(-yhat))
```

### SEM_BOUNDED (one bound, e.g. a non-negative %GDP)
```text
lower bound: y = log1p(value - lower);   value = lower + expm1(yhat)
upper bound: y = -log1p(upper - value);  value = upper - expm1(-yhat)
```

### UNBOUNDED
```text
y = value;   value = yhat
```

Final values are always capped by `lower_bound`, `upper_bound`, and
`allow_negative`.

## 4. Minimum Data & Shock Years

* A proxy needs at least **5 usable annual points**; below that, trend and
  volatility cannot be separated from noise, so it is dropped.
* Shock years `(2020, 2022, 2025)` — COVID, the Ukraine war, and the 2025
  tariff shock — receive `sample_weight = 0.5` when the proxy's policy is
  `DOWNWEIGHT`, so they influence the fitted local trend less.

## 5. Diagnostics

Computed per series and used both as review labels and as inputs to the model
(the `uncertainty_level` sets how hard a series is damped).

| Diagnostic | Meaning |
| --- | --- |
| `slope_p1y`, `slope_p3y`, `slope_full` | Normalised raw-value trend over 1-year / 3-year / full windows. |
| `cagr_*` | Growth rates where start/end are positive. |
| `trend_r2_raw`, `trend_r2_y` | Linear-trend fit quality on raw value and on `y`. |
| `residual_std` | Residual spread on `y`; drives confidence-interval width. |
| `y_change_volatility(_ratio)` | Year-to-year variability of `y`. |
| `shock_sensitivity` | How much the fitted trend moves when shock years are removed. |
| `change_direction`, `change_speed` | STABLE / VOLATILE / INCREASING / DECREASING; SLOW / MEDIUM / FAST. |
| `uncertainty_level` | LOW / MEDIUM / HIGH, from ordered historical-pattern rules. |

## 6. The Forecasting Model (damped blended trend)

Everything is done on the transformed `y` scale, per series, for horizon `h`
(years ahead of the last observation):

```text
y_hat(h) = last_y + clip( blended_slope * damped_steps(h, phi) )
```

**(a) Local slope** — a weighted least-squares slope of the series' own `y`
against time, with shock years down-weighted.

**(b) Slope source** — if a series has enough clean local evidence, the model
uses its own local slope directly. Otherwise it uses the median local slope among
series with the same `id`.

```text
if n_obs >= 10
and trend_r2_raw >= 0.60
and change_direction in {INCREASING, DECREASING}:
    pooled_slope = local_slope
else:
    pooled_slope = same_id_median_slope
```

This borrows signal only from comparable proxy-family peers. It does not pool
across unrelated IDs, because raw-value proxies can live on completely different
scales.

For a GLO-only proxy family with one series, the pooled slope equals that
series' own local slope.

**(c) Credibility blend** — shrink the local slope toward the pooled slope by
how much evidence the series has:
```text
credibility   = n_obs / (n_obs + 8)          # ~0.56 at 10 points, ~0.38 at 5
blended_slope = credibility * local_slope + (1 - credibility) * pooled_slope
```
A series with a clear, long trend keeps mostly its own slope; a short or noisy
series leans on its peer group. A direction guard prevents the blend from
reversing an observed INCREASING or DECREASING local trend only because the
same-id pooled slope disagrees.

**(d) Damping** — the projected trend fades each year so the path flattens
toward a level instead of extrapolating in a straight line:
```text
damped_steps(h) = phi * (1 - phi**h) / (1 - phi)   ->  phi / (1 - phi) as h grows
phi = { LOW: 0.85, MEDIUM: 0.80, HIGH: 0.72 }      # by uncertainty_level
```
Effective drift horizon = `phi / (1 - phi)`: about 5.7 / 4.0 / 2.6 years. Because
`damped_steps` converges to a finite limit, the transformed forecast approaches a
finite level and can never run off to infinity.

**(e) Guardrails**
```text
slope clip : annual step <= 3x the series' own yearly-change volatility
drift cap  : total move in y <= 2x the series' observed historical y-range
sanity cap : one-sided-below proxies (log transform) capped at 2.5x the
             historical peak in value space
```
The sanity cap matters because a log transform turns a linear rise in `y` into
exponential growth in value; without it, a fast-growing count (e.g. a country's
peacekeeper contribution) could blow up to implausible levels.

The forecast is then inverse-transformed and capped to the proxy's bounds.

## 7. Anchoring

The projection starts from the **actual last observed value**, not a fitted
value, so there is no discontinuity between history and forecast at the handoff
year.

## 8. Scenarios and Confidence Intervals

The main scenario is the model prediction. Optimistic/pessimistic scenarios and
intervals express uncertainty around it:

```text
spread        = { LOW: 0.10, MEDIUM: 0.20, HIGH: 0.35 }
ci_multiplier = { LOW: 1.28, MEDIUM: 1.64, HIGH: 1.96 }

scenario_delta       = |main - latest_value| * spread
optimistic / pessim. = cap(main +/- scenario_delta)
ci_y_delta           = ci_multiplier * residual_std * sqrt(horizon)
main CI              = inverse_transform(final_yhat +/- ci_y_delta)
```
Each scenario carries its own interval; all are capped to proxy bounds. For
downstream analysis use `scenario == "main_scenario"`.

## 9. Multi-Horizon Backtest (honest accuracy)

Accuracy is measured by **rolling-origin backtest**: train on data up to a
cutoff year, forecast 1 / 3 / 5 / 10 years later, and compare to what actually
happened. This reflects the long horizons the project cares about, unlike a
one-step-ahead check.

Reported per horizon on both scales:
```text
r2_y, mae_y          # transformed modelling scale
r2_value, mae_value  # original units after inverse transform
```

On the current workbook data, the model scores (transformed scale) roughly:
`R2 ~ 0.779 (1yr), 0.676 (3yr), 0.656 (5yr), 0.547 (10yr)`. Accuracy decaying with
horizon is expected and honest.

## 10. Output Fields

`run_forecast()` returns `(forecast_df, diagnostics_df, model_components_df,
model_metrics_df)`.

* **forecast_df** — `id, proxy_id, market, year, value, labels, metric, scenario,
  lower_ci, upper_ci`.
* **diagnostics_df** — the Section 5 table (workbook sheet `Statistical Data`).
* **model_components_df** — per-series `local_slope, pooled_slope,
  pooled_slope_source, credibility, blended_slope, phi, effective_years,
  max_drift, y_ceiling` (workbook sheet `Model Components`). This makes every
  forecast fully auditable.
* **model_metrics_df** — the Section 9 backtest table (workbook sheet
  `Model Performance`).

## 11. What Changed from the Previous Pipeline (and Why)

The previous model stacked two machine-learning meta-models (ElasticNet +
HistGradientBoosting) on top of several base forecasts, with a learned blend
weight.

**The problem.** The stackers were trained only on **one-year-ahead** examples,
then used to predict up to **15 years ahead**. Far outside their training range,
the linear stacker amplified extrapolated inputs while the tree stacker
flattened — with no mechanism to stay bounded. The result: about 61% of series
reversed their historical trend direction, and several collapsed onto a bound
(e.g. Paris Agreement ratification falling from 98% toward 0%) or exploded. The
one-step-ahead R2 (~0.86) looked strong but never tested the 2040 horizon.

**The fix.** Replace the stackers with the explicit damped-trend model above,
whose long-horizon behaviour is bounded by construction (the trend fades to a
finite level) and anchored on the last real value.

**Effect across all 640 series (main scenario, 2026–2040):**

| Check | Old | New |
| --- | --- | --- |
| Series reversing trend direction | 61% | 4% |
| Series collapsing to a 0/100 bound | 5 | 0 |
| Large jumps at the history→forecast handoff | 20% | 9% |

**Head-to-head backtest (cutoffs 2020 & 2021, horizons 1–5, transformed scale).**
The two models are competitive at the short horizons that can be tested: the old
model has slightly higher pooled `R2` (driven by a few high-variance series),
while the new model has lower mean error, roughly **half the median error**, and
is closer on **64%** of individual predictions. The new model's decisive
advantage is at the long horizon the project actually targets (10–15 years),
where it stays realistic and the old model does not — a regime that cannot be
backtested because history ends in 2025.

**Also simpler:** the stacking layer, out-of-fold training, id-specific routing,
and learned-alpha logic were removed, along with the scikit-learn dependency.
The model is now a few dozen lines and can be explained on one page.

### Generated files
The `Model Outputs/` directory is generated by notebook runs and should not be
committed. The active forecast path lives in `Modeling/forecast_2040.py`,
`Modeling/simple_forecaster.py`, `Modeling/scenarios.py`, and
`Modeling/backtest.py`.
