"""
Transform Function — D10: ICJ compulsory-jurisdiction acceptance (GLO series).
Source: ICJ declarations list (https://www.icj-cij.org/declarations).

Value = cumulative NUMBER of states with a declaration accepting ICJ compulsory
jurisdiction (Art. 36(2)), counted by calendar year-END (a declaration deposited
any time in year Y counts for Y onward).
Market = GLO (one global value per year).

IMPORTANT CAVEATS (this list is the CURRENTLY-active set as of 2026):
  * It cannot capture historical WITHDRAWALS — states that accepted then left
    before 2026 (e.g. the USA, withdrawn 1986) are absent, so the count is the
    number of *today's* acceptors that existed by year Y, not the true net
    active count in that year.
  * Each entry uses the CURRENT declaration deposit year, which for several
    long-standing members is a later MODIFICATION/replacement (e.g. UK 2017,
    Canada 2023, Netherlands 2017, Germany 2025). Those members therefore only
    'appear' from their re-declaration year, which understates earlier years and
    inflates recent growth. Treat the level cautiously; the direction (rising
    commitment) is the usable signal.
Set `as_share=True` to divide by 193 UN members for the % version instead.
"""

import pandas as pd

UN_MEMBERS = 193

# (state, deposit year of the currently-in-force declaration). Year is parsed
# from the trailing token. Sourced from icj-cij.org/declarations (Feb 2026).
ICJ_DECLARATIONS = [
    ("Australia", 2002), ("Austria", 1971), ("Barbados", 1980), ("Belgium", 1958),
    ("Botswana", 1970), ("Bulgaria", 2015), ("Cambodia", 1957), ("Cameroon", 1994),
    ("Canada", 2023), ("Costa Rica", 1973), ("Cote d'Ivoire", 2001), ("Cyprus", 2002),
    ("Democratic Republic of the Congo", 1989), ("Denmark", 1956), ("Djibouti", 2005),
    ("Dominica", 2006), ("Dominican Republic", 1924), ("Egypt", 1957),
    ("Equatorial Guinea", 2017), ("Estonia", 1991), ("Finland", 1958), ("Gambia", 1966),
    ("Georgia", 1995), ("Germany", 2025), ("Greece", 2015), ("Guinea", 1998),
    ("Guinea-Bissau", 1989), ("Haiti", 1921), ("Honduras", 1986), ("Hungary", 1992),
    ("Iceland", 2026), ("India", 2019), ("Iran", 2023), ("Ireland", 2011),
    ("Italy", 2014), ("Japan", 2015), ("Latvia", 2019), ("Lesotho", 2000),
    ("Liberia", 1952), ("Liechtenstein", 1950), ("Lithuania", 2012), ("Luxembourg", 1930),
    ("Madagascar", 1992), ("Malawi", 1966), ("Malta", 1983), ("Marshall Islands", 2013),
    ("Mauritius", 1968), ("Mexico", 1947), ("Netherlands", 2017), ("New Zealand", 1977),
    ("Nicaragua", 1946), ("Nigeria", 1998), ("Norway", 1996), ("Pakistan", 2017),
    ("Panama", 1921), ("Paraguay", 1996), ("Peru", 2003), ("Philippines", 1972),
    ("Poland", 2024), ("Portugal", 2005), ("Romania", 2015), ("Senegal", 1985),
    ("Slovakia", 2004), ("Somalia", 1963), ("Spain", 1990), ("Sudan", 1958),
    ("Suriname", 1987), ("Swaziland", 1969), ("Sweden", 1957), ("Switzerland", 1948),
    ("Timor-Leste", 2012), ("Togo", 1979), ("Uganda", 1963), ("United Kingdom", 2017),
    ("Uruguay", 1921),
]


def extract_transform(raw_file_path=None, start_year: int = 2000,
                      end_year: int = 2025, as_share: bool = False) -> pd.DataFrame:
    """
    Return the D10 GLO series: cumulative count (or % of 193) of ICJ acceptances
    by year-end.

    Parameters
    ----------
    raw_file_path : ignored (data is embedded from the ICJ list).
    start_year, end_year : int
    as_share : if True, value = count / 193 * 100 (percentage); else raw count.
    """
    deposit_years = [year for _, year in ICJ_DECLARATIONS]

    records = []
    for year in range(start_year, end_year + 1):
        count = sum(1 for y in deposit_years if y <= year)   # cumulative by year-end
        value = round(count / UN_MEMBERS * 100, 6) if as_share else count
        records.append({
            "proxy_id": "D10_GLO",
            "market": "GLO",
            "year": year,
            "value": value,
            "labels": "%" if as_share else "number of states",
            "metric": None,
        })
    return pd.DataFrame(records, columns=["proxy_id", "market", "year", "value", "labels", "metric"])
