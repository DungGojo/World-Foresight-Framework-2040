# Model limitations — how to read a 2040 number

Companion to `PIPELINE_METHODOLOGY.md`. That document describes what the forecaster
does; this one measures what it means for the analysis, and sets the rule every
topic write-up follows.

**The one-line rule: shares, ranks, gaps and compositions are findings. Absolute
levels and growth rates are conservative floors.**

---

## 1. The damping is strong, and it is by design

The forecaster is a damped blended trend. The projected slope fades each year by
`phi`, so the cumulative drift converges to `phi / (1 - phi)` years' worth of trend:

| `uncertainty_level` | `phi` | effective drift horizon |
|---|---|---|
| LOW | 0.85 | ~5.7 years |
| MEDIUM | 0.80 | ~4.0 years |
| HIGH | 0.72 | ~2.6 years |

A 2040 value is therefore roughly *last observation + 3-6 years of trend, then flat* —
not fifteen years of trend. This was a deliberate choice: it replaced an ML stacking
ensemble that produced unrealistic long-horizon behaviour, and it guarantees the
forecast can never run away to infinity.

## 2. Measured effect across the whole dataset

Comparing each series' 2010→2025 CAGR against its 2025→2040 CAGR, over 3,901
series covering 170 proxies:

| Measure | Value |
|---|---|
| Median share of historical growth retained | **15%** |
| Interquartile range | 5% – 28% |
| Series that grow more slowly than history | **96.4%** |

By topic, the median retention is 0.18 (Power), 0.11 (Technology), 0.14 (Planet),
0.18 (People), 0.14 (Economy). The effect is uniform — no topic escapes it.

Concrete consequences:

| Series | 2010-2025 actual | 2025-2040 forecast | Reality check |
|---|---|---|---|
| US GDP, nominal (D142) | +4.9%/yr | +0.8%/yr | below plausible inflation |
| China GDP, nominal (D142) | +7.9%/yr | +1.3%/yr | below plausible inflation |
| Atmospheric CO₂ (D59) | +2.4 ppm/yr | +0.5 ppm/yr | observed run-rate ~2.5 ppm/yr |
| Global sea level (D60) | ~4 mm/yr | ~0.8 mm/yr | observed run-rate ~4.3 mm/yr |
| TOP500 #1 performance (D19) | +54.8%/yr | +0.8%/yr | exponential series flattened |

## 3. Why this does not damage the analysis

Damping applies roughly uniformly across markets within a proxy. Anything computed
as a **ratio between markets in the same year** is therefore near-unaffected:

- share of world (`analyze_share_of_world`, `share_trajectory`)
- rankings (`rank_market_relevance`, `ranking_stability`)
- concentration (`concentration_trend` — HHI, effective N, top-k)
- dispersion and convergence (`divergence`, `gap_movers`)
- composition and signature (`power_profile`, `typology`)
- alignment tilt and balance (`alignment_tilt`, `cluster_to_anchor`)

Topic 1 is built entirely from these, which is why its conclusions survive scenario
testing with zero rank changes.

What is **not** safe to quote as a forecast:

- any absolute 2040 level (°C, ppm, USD, %, personnel)
- any 2025→2040 growth rate or percentage change
- any threshold-crossing count derived from a level (it will undercount)

## 4. House rule for the topic write-ups

1. Answer sub-questions with shares, ranks, gaps, composition and direction wherever possible.
2. When a level is genuinely the point — warming, population age structure, debt ratios —
   anchor it to the authoritative external projection and cite it: IPCC AR6 / NGFS for
   climate, UN WPP for demography, IMF WEO for GDP and fiscal, IEA for energy.
3. Use our series for the *shape* of the distribution across countries, the external
   source for the *level*.
4. Label every quoted level from our own data as a floor.

## 5. Degenerate series — exclude or handle explicitly

64 country-series have a perfectly flat forecast (zero variance after 2025). Two proxies
are unusable outright:

| Proxy | Problem |
|---|---|
| **D18** Frontier AI training compute | constant 6.339 in every year; history only 2000-2006 |
| **D20** Genome sequencing cost | forecast floors at exactly 0 |

Proxies with the highest share of flat country-series — check before using at country level:

| Proxy | Flat / total |
|---|---|
| D165 Food import dependency | 12 / 33 |
| D97 DRR strategy coverage | 5 / 18 |
| D12 UN peacekeepers | 9 / 35 |
| D95 Disaster economic loss | 3 / 21 |
| D114 Conflict displacement | 2 / 14 |
| D138 Political-violence fatalities | 4 / 34 |
| D166 Mineral rents | 4 / 34 |
| D72 Disaster displacement | 4 / 33 |

Most of these are volatile event series where a flat projection is the honest answer —
the model correctly declines to extrapolate noise. They should be presented as rolling
evidence, not as forecasts, exactly as the Topic 3-5 architecture documents specify.

## 6. Reproducing these numbers

`Data Analysis.ipynb` → section **Data reality check**. It calls
`Analysis_Functions.growth_profile` to compare historical and forecast CAGR per series,
and prints the flat/floored series list.
