const trFieldString = `
<tr>
  <td>
    <input
      type="text"
      class="form-control fieldText"
      placeholder="Text"
      aria-label="Text"
      aria-describedby="basic-addon1"
    />
  </td>
  <td>
    <select title="Select Icon" class="my-image-selectpicker">
      <option data-thumbnail="data:image/png;base64,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"></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAKjSURBVHhe7VpNS1tBFM2vedsYm8T+BVNbNGr9C1qrUBtbPxbZFLroonTTRRcFcSEoCHXRRUEQREpp3Uq7yEJwU6Eg0q71HLiBx/CSvJgZnZneA4d5IXM/383MnfdSUCgUCoVCoVBYxv2Z9QRsdmAi0+ICA2OA1amXr8sTz3/i+iqLlcnly2Jt7pDz8DmOZDAQBPY5HWgeQuaiXG+8xXWYlUGn6TwC+cuABuHI47VNjOEkgc5Wp1a200EMymCSQCdtB9+m6PU3CXQO/Nh22AWr0ytbGP1MAhzjgpXpuGU2xaQ/gFNJpd44MBx1QrEzCjaHHy1uDNXmjrB9toq12V9DD57sY6t9x+/A26sUMZjpsAuiV+iZ7FtdOO+NP/tgOuADK5Mv9jC6TQINoGn5kzbsGd2uGTRgGPSKWBNOMbqrAij3OgFCd1VA5YYxH/l/J4CLtLhrF1DuvPuzQfYG4rI9QDGan+UvpjFPafcnAIUJsvrbMOIz7SUAyhI0GP8MA94SVXqCke3x4FshleDOn7WVh8TyxFJrZHr1Fa5vlggKIvgfaaUhEueIXYz9JwFCIez3uSjPKfMngZNx97+llYTOvg5KmBjN3TeYb3fgREMwCqKqv2LsXQVoJd+bwhGxdxWUxuY/ZQhGQW6NEmZnFGuz37OEY2Dp4cKWhNkZfNiYJRwDpbHrvg6Uxp7umIKRsfs6gMbhTYZQFCzXG+cYu1cAJsTaB1zxlbyE2RmYGNrxNzdZ3RJmd8hJKlNJ4MzdDaIKllqGcNCU801fh6LY1oL+nhRBIIiHoHl443eHFAKDTsLAf7agMNgMcU2w+taYirg7hLBFyv8KuIbZCT4NKqVy7qlsm3l2QINxfJekD/BlV7ZvN4ErFAqFQqFQKBQKRTwoFK4BwMVHV4reFrIAAAAASUVORK5CYII="></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAOgSURBVHhe7VpNaxQxGN5fM1dburv1N1hFd9vqb/ALdG1r1UMvgkfvgl48CHoTEREKHoQiKIIHD4IHQRAFUUTP+jzpm5DJzs5k52Mnu+aFh0zyTN68eTbJZDLbiRYtWrRoDdjRMzcSYK9mJOI+bGOg3cGVA6R/60Rvffvn8vELj3AdrhgMrDsYfdBBNwUI/AVpeEJIUJlBN4H+xu5DpOGIgGBmKgARlAgIZEyA3nBrf+XkpbtVQB+uXxvBiIAgskbAntCljT4cn2MIQgQE0JoARH9z9wHS9kRA460KIKjcXmlj404wtQREH47PiZA9SDujAA2HMAKIekcBHGZtbcdUlvLag4EP7i5fO37zUF0AOFGdXlo7t49t6C/LuQIeTT+WT1zkomPEkOvUfSxTDisa/CR8JB45dvaNDQjz1WmveptwkKDTTx2neVANMnXKDdeU0b/TXvU26cBxmAuOBqR6mrj8/AmwtHb+SYbTIjCQ+RcAlTn8x+Z8Eaz1wOXmToAsh4XAYvkMaRAC8OwAabm9ACrOvQBEaRFQqVYBuoPRe3JNgf7dNjX04ixd8zNUqHsEtIrucOu2dM3PUGnRBPiO1H8U4OaFEkDgvw7xZqeyF6IAUYAoQKEAWJBe2oedeJP7bLjB6J3Dmddf7kxtDo+3F5rzRDAjIBUI8z4cOy3FylDG84Gs1+BJWCwBaDwL0LwHogBSrdh4s1PZC9MKgOtk9fT1+1kcjXnNyZw3mxleYz35pnkPhCEAd2WTjrJ66zt/NEe4r+S839SdrvNEMCOgLYQhAF9Rza+YsYrrXzmPI+QtL8UXIJgRYALBdSKfsjR3j2Wak7ziuH/QHI3XnE6a90B4AtCY9+HiYzAKsCA7QSxeqT9LYP//UXPo0EGKO5z3hxzmu83Rj+Y8EcwIaAtRAOlesfFmp7IXPAXgo433KGBfYH9/THGSVxymx1urXAF1f5PzRDACpAJh3ofjvJdiY/ExGAWYTwGcNWDnsZSPcZJXHNYAHo/ZHNeAaT7gBiPAzCFC/b8fRhDXc+man6ES/x8wzSNGIef/Aa2iv3H1lnTN36halrM8rG5eu4k0KAGwdrxC6j/8taFSmY6wDt/TzR6+Tch5wfSdp7Fib7jtPQrkcNMcZkD5TzY/a5T+5W2jAw5rODNfb1yA01vUVGPMr5y6fAdrCf+lkVm3bnC159TlnEe+WudtozOAncxCbkPknfubRH2djhYtWrTFt07nH3sltwiL7/+XAAAAAElFTkSuQmCC"></option>
      <option data-thumbnail="data:image/png;base64,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"></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAOISURBVHhe7Vo9bxNBEPWvuYIGA3bCH3CTIMAmwG9IhBCyEz4LN/wNkBAdRQoKCiQkChANCIkCRTQ0SIhIEQhBDW/Os856PXfeXfbOZzQjPa1zezsz+3b23d4pLTU1NTU1NTW1Ou3s1XsZMHaQcXeh0T3OGAkL/SzVKMHupb1naP/Y6A52X1If3yba6fPXH7njXHT6o/dom0kCJdbpDz/ZCdtA8t/QiqtI10DcL3PvAox5WDMMCeWliwn8sJIsxPqVu4/RzpCAv4kY8X4BzSEAyWQ8ISnRQqxt3X6CdkoCfq8eAUgEZXvzqZOcN7qDvedocxLQrhYBSCLrDHZfOYkFw4gasDoEIIFSsQsFSPiK9qF7vQTLIQCBg8QOoEmNUSmHzvV/Rf0EIKi32GFFv6CdPu6oRcV8NP0JUC8BCJitbd3ad5IQgcm/RUuVkp06d22/vbnzwvzNhyFxXCDqIwDBvMWOT4A9YMz72lz/Sdeojx9/c2MDUQ8BCITSHR04wUXwxGjyhWLGW6gXc25wUC0BCJCLHVb+yApaBpq01+rOVEm8OFZHAJzHiF0vZH/bOhEpjtUQAMdRYue7TWxgDGlETl7EgSo9AXDqL3aTI6wpY99tUgTePn7EM9ISAIfBYpdAyKYI9YlcZ84Z0UYOyFGo2LGQSf3RYA0JrSrKJ44EGhjA+PF+7Y/e2H0pwYIYpCtcPWEk0IAAsaO3NXO4+Wz3VQFe/SBx5Ir0I4Fu9HZ8LHaFh5uqwNXpLY5YnPypxNOUjW4ILK1UR9comENToDjKJFBHQAlPxG5SAVJ/bUDOpDn5FoRQfrf7JPAWmicBF2lfiYMMEMx8tYXYDT/YfcsEL5zJy+dDzPw5ARdL9z5P2DyGUn/ASIW8Mj3mUboN5jQApZW/s69fvnPf7WsajDZJH2O5gj2E0Fph8xwl8Hv7jNOGgraDdI7xOyLTYLqZkTPGv21nTUY+UbT2PKZziTJ2IAVrIip5G1QCnCBNhhLAaaczcuoEiQI9Us9cuPGgCImeNI2ugNLkTm5svxPGhEIJYHfpjJw6QWKhBLBL0ZQAJUAJUAKEMaFQAthdOiOnTpBYrCwB9C9vv51AMVhNAsjamzspvgJXSkDhV98URo75u5oYfBHwokP/PVaaXHtj+7U7zhfkv3NxeIJdVWMI5H5mCsHClaF7nDEhqGbl1dTU1NTU1P5Da7X+AuWvx9yywE3VAAAAAElFTkSuQmCC"></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAMUSURBVHhe7ZjPixMxFMf71+zV6rZd/4auqNvu6r9gVxB/tLrqoRdvexAv3vQiIngQ9CAiLHhQRBAEDyqCiCDICqIsetbvt76UZCZLJzOdTlPeFz68mc7La/KSSTKpqVQqlUqlUqlUKpXKo8Mnry6B4aGjZ+7WVzefxADryjqz7tKMfGKAZnfwC/ZvjDQ7/Z+w+RLBQmj8bxMscobSrOxqdPrXPYGipLF24Q1s2Ciot3svkoEiJ2wUHGj3PnmCxExoAk699wSJmbAEHDxy+qEnSJQ01s5/hA2bA1CAy4c3YISErwIotITZ82UiUHSg9zmX5dsQsSCWwx92wAgJ731bDJAIGA0rJ67cgS2+HQbDZvfiHxM4Bgo1ngWxDd62A/BaZlPvH84LmLe+wY73/7QrG5evmftMkgAM9lWux8EwEh7x2TyCj58d2GSnvZXn2ecCOkshw20wTgIYIjm78qxyMFr37F6mBawjO9D4FUoA/mTU8052m53BU9unCtDIV7BOvVobW/dsH6FYAoisqc4rwXv57k75l4001Gm8JMTnXzwBhtb61n1Y9487/ee2T5mgI97BOh3BV2DC+cX0EkC8lfi/9Hj9p0Vr/dID2DzJn24CDPYwpAWcfHgA4fXPC2J+gXUSzvuAI7tyEkCkwU7l5DXx+ofin4BHS57Xfx/KS4DB3n3RAo6GD+Z5KCib2ofwHkP+O58HUn4CCCrNL0i3t7qDx7ZPFnybmoKbsNkkgMh7meq5rMulfySNlmCvf0ZmlwBD6Lsro8dJ3BTnktkngMgckBoNPHavr27u1Nu9Z8vHz920fSheo+xrWG/cHFSTAEPWz1P6ZNjU5KHaBBD06K58tKR6W37jqvEZ1lu+INUnwIYN5WuAnt7GBDeLc4b5SkAFaAKkeZNF50ThRUATIM2bLDonCi8CmgBp3mTROVF4EQhKALehPIDwBYoO7DX2YCfuQh0hATeSgWJl+djZW9Ks7EJBjoKytqUzQw5PwnrfiAWRhP2OmeceObjN13gjBgCcFGOkWONVKpVKpVKpFle12j9TAYqCC5oajQAAAABJRU5ErkJggg=="></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAANtSURBVHhe7VnLihQxFO2v6a2P6e7xGxRHp2dGv0FB0XnoqIveCC7FjTsFcSG4UHAhIgguBBEU0YWIGxEEURAHf6A9p+ZmSMV0vVJVndJ74JCe5N6bm1M36XRNT6FQKBQKhUKhUCgUHhw6eaUPTg4unb2z/8jpJ13ggaNn7jFn5i7LqAYGGCxvfEU77SKHK1s7aKsJQScE+G2CdZwTWVZxsOQ9gTpJVPFbtMWrgMaD8eYPOwiJQN/3HT71JmYyRzdvYfEqoLHjPIUgL9CGHSotgDkunrh8185dGCYAT1cZjh6j1YvX3PzBwArYLa1OVAByfWXnLgwTQFj+NG0ZzNHJuXzuNHacEw5XLjxCG20VMDeU/wM7Z4u1VAAZbRUwNydXm/UIEOtZwJyQ22c7V4e1VQBF+II2GhGYy2B5/b2do4f1CUDiXvATLe3mJgTnZg7yQLx5WqxXAMPR2jZ/ebUuAuecceGZxTABhuOtd26fIcaeom1NBM6VcdpPMfbc0x8mAMrs4Wh1+77bb4jxj2gbF4FzYC7fRSchfsE+RnvD7QfDBFg4du4WWu6523a/Tfn53Mi5wJiMjcV/41w+ypZI7Ox+YbgAMiaJrH+yx21KpdQmAmNl7XeIwq/mPeHls2tXjwAG6OsPx5vPXDtDjHEfBovAGFLW3nmw+JdoU/Pg7+YFINDfl2+BlK2hVMnekykL+mGBr008l3IQ/hUbfe0IQGBsd0t4XqBY5LlRWATagpVjor89AQxgk/O0ip0LtMne7/lVJeOub7MCELDL3K959wWOZX2/Fz1XYDMfAQjY5j3BD2hTT5Cf2YcK4stLr1+ZbxbYzU8AAvbJgvDEftkxbEqlcJ5J1lMXlj1D5iuAAfx4LvCGmIpVlPDlpYe5FF48IT5uvPYFIOCbeV+YRSye191SCzeAXzwCEPDvL65dupq1JWyG/sKEb1wCGCAO/+FyXd4lpOLjTNhZOH7+Jj5z7sqLJyRGKj77ZDgfNHacaxHAAPGSQ9Jh0KJtSLxU/uyT4XzQ2HGuVYCm4cuffTKcDxo7ziqACqAC/OcCyMWE/dFzxtW6lAC8whZ5194JyrvKcl+zEMD3ZrWTrLR94cgqyPpfWycob5WqXbLoKHvfGzx2yruHsBsmA4Dew6YDrO16rVAoFAqFQvGPodf7AwF1UEh/z3lYAAAAAElFTkSuQmCC"></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAPHSURBVHhe7VtNaxRBEM2v2auJm038DUnQfKm/IUbEmKyfh1wEDzlILh4EBREvCoIiIoLgQVFBETxILiKexIMogmd9L1bD0PbOVvds9/Qs8+DRy2Zq+lVX9cfUTiZatGjRIgUOHb/UAbenlzZ3Dx4+dWty/sSTybm1lwfm1l7zM767013cuMZrhB0xbS6M03S4t9L/hc9/tMRAvUHbzIGgaIqHE6/oTBVOL535iLY5A0GhiPZj48Co2FveeoY270GgwFFEfRAlG/IcBAqD85+LgmNwennrO9q8BoGCEJ1PRaExmdUgUAgEvSgKTMEspgMF9FbOPiwKS8naF0Z0zu3JKS4ht0VOWqDjDiLw3BKjIhbLPUybq/i8f+rDtrkzOb/+CNn0u3idhpgKH9CmzwJ06h39Yac7fi9p7bQvYfosgDO7DiEDOXvs4m20QyPFa8Cbxk7DqYWT98Q8DdAp9/yvtpBBnFk9fxetOk15rQyY8342ZeqkmwboTJ3+odsVbTy313TTgJ1ZnZcxWBhtrXsNJKekmMXHzOq5Ky4RNrGg/UAbnJq01Z4wWU8Qs/joHjl9wyXCJhan+2ISDO1iy6KKmMTH1ML6A5cIm8wUMQkG7qOaBqwsiUl8MLIuETZ5wBGTYOA+qgFgeU1M4kM7BXi6E5NgdBc3rrvubTPpFECHqqggA36irbgI6moMDIqYxQc6zG4bHMV0UwMdqoUhgl/Qhh2EljbfF+81hEkPQurUJHvL/ado1YPAa+X47LyfzapTLQhMOVtIGbWDwGuwfap2GUMulGKeDujYZx3Yp0wH2v03EPyOf5NnB6d9CdM/DqNT70gZMmX/FUD6Ozws8Vwhx2bn9WWUB6a06W+Ajr2zIALTR98AnUf5FUhLTKm3aOuJvgEE1JkF9UXfACKCi6NViOjvoa03+gYQUkcW1B99A4jhwYgVX5fQkVMOYXlE3wCCkmXB7NELl6XbfABhLF+FHGK8iOh/Q5tX9A0gLHoWjKLKFA0Q6PWQ5MtaHnp8AYHRsoBHZ+kmX0Aos0D9q5En89n6ysBV2iG+EuU9hLzT34BCQ5/uStiM6BtwtXY4EUTfilIWoGAsWl5vh5awWdE3kLdAXA6pWWvBoyogfBRbYjOjT0B8pYIJttP6Cx5VAQeqZEFzo28AJ7Al7q/iLgcHEtHPp+BRFXAkJAuaH30DOOP1vo88UI1H9A3gkDoLsix4VAUcU5XNcE2+BY+qgGNDs2Aso28AB0vfAtW+Tdpo0EFwm8dkvtgEviv8u9x4O9+iRYvMMDHxF8clLreNYOaNAAAAAElFTkSuQmCC"></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAKKSURBVHhe7Zo9SgNRFIWzmrSKZsQ1KIhJBNegheAvgkWWYG8h2FpaibUgFjYWIoKFpYLoDvSe+JTxMBrxnkle4B44vEDi9753HWMx04hEIpFIJBJRZXZ5r2nt1dRm2ibPQLDo7pzY+lZHi872ma15DgFirfbGTVm4jtoe97bmN4RWZ2ufZetqdlcCZGwAz2XJIbSXth99IENyw+j4DsC+KC+qWvXZXxpXQNp+9IEMyQ2jMYC0/egDGZLrt9XefJyYW7nyFIwqtjX7ARxa3f+rwUgs5mc/AJkgWMSW8t2BDMlJBcEitpTvDmRITioIFrGlfHcgQ3JSQbCILeW7AxmSkwqCRWwp3x3IkJxUECxiS/nuQIbkpIJgEVvKdwcyJCcVBIvYUr47kCE5qSBYxJby3YEMyUkFwSK2lO8OZEhOKggWsaV8dyBDclJBsIgt5bsDGZKTCoJFbCnfHciQnFQQLGJL+e5AhuSkgmARW8p3BzIkJxUEi9hSvjuQITmpIFjElvLdgQzJSQXBIraU7w5kSE4qCBaxpXx3IENyUkGwiC3luwMZkpMKgkVsKd8dyJCcVBAsYkv57kCG5KSCYBFbyncHMiQnFQSL2FK+O5AhOakgWMSW8t2BDMm9Fd3t18n51VNFf7g9lv0VUHdjAGn70QcyJDewxcfjdPi53szS7nH5vT92fAeQ/qa/7hzjdau9cVf+zB861gO4tfXbrfOphbUj/tyAZjWAZtHZeiHBQf06gL3+z2N2+QwAmV5cP6iQ/LF2FTzY2v8OsMv/uvzeoNqwzm3N62lRCKVDVUqraod/sjWvw38GYum3UynvrQ340tY8D/8ZCFr7l3YNzfvwkUgkEolExiiNxjuSi/nq/8s0PgAAAABJRU5ErkJggg=="></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAANYSURBVHhe7VtNa1NBFM2vybatTVp/Q7RqGqu/IaJiP6xfi2wEFy7EjQvBhYh0IXThQtwIQhUUBMGFiCAiCKIgiuhazwl3wuswjS8vM9M7yVw43IS8uXPunTvzZu6QWpYsWbLEkIMnr9SBHjF/bPX27KFTj2db3eczre4Lfj5w5Oxd8zuflWbpC52hU432+kvov2XQaK+9hU4/EHSgubzx1Dg2KiRoaQaBxDGSH4oOVUFjeeMbdFrZQLLNzvmfxglP6Il53QKiGPn1Lxb5sdHsbP6B1p0FJAjnXxWJ+4RMKb1BADnOVSd5X1g4fuGadKdLQI6j/9Em7BuytujLApAKPvoF6FsQ8bq64SAaBHNLZ7akWz3Cba2LbAhgGvyC1jMNSAakfhdJRoCeaUAyFrkYyAGQ7vdfSMYiFwOqAsBT3w+LYGjoehWyqOEgGQTYcH2F1rUZWly5dNUmGgoIwE3pVo+A2HTvBEGqjt3gM4uod2D030HrPBGCWIws0Df6RkCujuPqtkXYG/CmeQKttx5AIcEQU6HRXnsDrdt5IyTqszIE599D63KehADO+T542TF/9Nwd+c7feEB6BO10qiwkm/r2APZzy7pE6fcntOIIO2x2Nh9CO0nLOjAgjWwYuUjKnaXsLfp2FlYubhV/LyLa2sBOgJ7U6p1kDOD0Z+hBNrCWJ68w5/MGLHzyWXwuBvC/7XgcNwETun6FhoeNwl4Aed7uDAIhn4dh8FyVWyXJTP9BgFGSc3ZaBgjEJxmhXc6K7V2BkUXPaacMFk9cvgftLwg0Bgd4AHF2WBUMykyruxOomuRnwwRDXlbz2JCpN34WwAjT0tlJAhg/C2RFdhlXD8nc6lnAxiHmfmRUzwI2toyliOkOAG+sxJ3RBXvu+y6jKaHyQYqNEL3vRWMJY/RpwEaWkZSRAyBulRc2soykjOkOADZE18Wt8oKGExMAVqrErfKChjkAtqFUkQMw7QEA8mtQ3CovbGQZSRmVAsBaQOk/OWgFy+zQ1YoiaDgJWTD66BtB47qUmF2G1cPcUIk71YQGhl2DaYXX6zIaAnhF9dp0oBUy5zl1/ThfFBqlcVaK5w6ffoCA8P7PSSQWWLQFl20eePA9jON7CTuTTvcT8RzOkmXSpFb7B+FwwIFi5k49AAAAAElFTkSuQmCC"></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAUASURBVHhe7VtLaxRBEM6v2YMIeZhsPAu5JD5j1JMXT8aoqIka9bAXwUNYxIsHRUFEBIWAoiKKIiioRBE8qAgigiAKooie9fsmNXHSW73TM92zO+IUfPRsP+o13dXVPUlPRRVVVFFFOWj1tmM1oMFSqjpOHdchFjiwfu+FwU3TH/D8e3B85kv/2t1Xh7ccOd4JRWId+tftuQwdPkU6oORv1hemAxkPjc88oEAbBjcdeIWyMCXIF8Y+jeVpQPszlGHlkyEYf04KSkFDhgYj8Kxhtn015KgY2nzwJ8owTiCjNK+bQH8uj2Bvgbwwu14mZaQB/d+h9NdB1rYqpB1Wbdx/Rlh4E97onCYjDZgxJ4VFfuobnWy77m0Y2nzoF0rvN0AemFFRsMsKWTL5deBgeP9HkmlGeMcC8jB4ZkV+HTjYYJYVy4Tjd7SFcVmt2rDvHLbP+f61U9f4XJ84fIJt7CPdI5I6jbcruu8AlJHhLoFMgteSI+RZ7esILwdk3f5MRIZgGd0y6lMhOQcd191lKBmWxrgt4LiPKEeybqFJYOwblDUuE7PNBfF4MSUfgUHeKXgaUfiRUp8Jkl2eNusd4ff2SWBSq2+ZzTQLsAU+wZj7WlseIEAu1Cdm72ptNkCH6yi9t+GIyEgYqsKSkLfeNOsDoDk0fvCOUt8CxI97KL2nfhS5BVEw4rOs7VahyL/jEyGywLxT1gqJJSNAAwZ+S7bFkMRnmb7xbzHLjTggGbywDt/GjAQx4yTibYunRlXBAFi2rSpY0k9iRzROtl93J9jyfxrG/BrPmvDGypEdA/LcMjYQGr2jO3tFvxb5PDPgxalpM+LIPMp0J7CTTKUWJmnoHZ18grJQB/SNTd1Q6l2RviuwkzHIGX1ju26jLNQBTJuVelcU6wBMP2aNwQNgAl4zgEtHzLQTjDilDc6ABaUuFJhcfVHqncC7SzHTTrzw1AZnQJEO8OKNJXpHzLSTrGOVgSOamEXMwbW23JA375VgIUg/FzPt5OsAGP8eZfA4gFT4PHjnPlgRTg7APhtiCmMW/E1EfAHDubd7p9dwwDsx007o9FAbnAXCI+R22GAAU+ozAS/3tZhpJ59dAGM/85prxZrtdfxmSno+2Z4HchKtkSd5y2xQ+6aB48VMO6Fj5jcnaSanKNd+lJKyBBYPL4s3xOrYdhjeevQiyohHIgWnjAXs6TdRquNscMoD0NH5/C/rvAnGZ3kabG2ffoEycgSeHyfb2kEOL4vjLJcqcj/AWMO+Le0mMt0PsCPAo6816opgGkYj1T4xxKF8c03mGXDW92Q7wVmS+MA5wreFfm3vAqEDT6nQwe4EtOX/XslBMlgDjeeHSFWwBhjEy1GOjZwhz8TS8uFU1xxkA3TgthstEwuyG55GZCrrXlXKBVA8CpiM7nhWL1lcEeQGKAtBGD2rKtNF+F+AuhAE8caHHteU6BokFhU/CyCkjG8/RvGzgEIMoaUBguecqFkcYRu7pAkvA2RbLG4ZkDm2qVz3hR1EccuAzA1hZUTlAFE3PJG5IayM+L8dgHzglKgbniCg9A7gdwNRNzxBQOUAU2DZ8N87AKh2AVE3PIE5/2LL+bKiSyjOASReVSlCS4H6xOwVlMUeiSmgpPcB4f9PwEYU5HslFhLyx1OduxIjUSAQ/+uK151eHkAm7xT5tYiBubPGm0QFRJFOortGV1RRRRX9+9TT8wfz/9fMEKEaewAAAABJRU5ErkJggg=="></option>
      <option data-thumbnail="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAMeSURBVHhe7VpNaxRBEN1fk6vG7CT+BjVqdqP+BhVFTdbPw1wEDx7Eize9iAgeBD14EAIeBBUCggcRQUQQREEQ8a7vhRppJj2d7d7ema1OP3jUsjuzXa+murqmZ3oZGRkZPth/4tocWJL9lbXb84dOP9lz4ORrfuZvcliaoEAI3YT9a2MxvPgUNr0gUBRYFsPR70qsg6Wclg4oqiaykciQV7DpZAHFQNQbU+QYTCcLlo5duW4R6GR/5cJ7WP1ZQBH9wfpPU5wH9WcBRdREjU1Mm++werOAziOV35mifLm4evkRrM4gwPHgq1+jzqlAx2tCgoip8BZWXxbA6VgZQOrLAjpdExHMhaPn78jf6gEcjxYA9hLyt3oAx2PVAN487c4aoPq+AI5PFAB0kC9htTdCax9MUeNycfXSY1i94iuE3AgtHb96H1a/eAJCvKaB6tbXBoqRKm4VbOFu3w1KZB/ABAUVw9EvU+gOTC8LUNVvWIRaiSmjex/ABgjyKobJbY9TjKztVsENTGsqUFBNoJMoiJ9g08oCFMNnpsidmGJf4H1/kFpnOCeCrGIdvAemE4RisP7CEDcu0ymKEMMHJj9qAp2UZopTKJlM8K4HwqDpwHPAcn75zMO9B09tSHPWXTA5uFR5m0gnQwojjt8WcNmv6C6rOLDv0ljRZ9OEx7neTei08+TAsv1ldc5FXMFvsM4ryN9w3OfqnCYyQJ1NCw4KJ33fIfhPrCobsNsc53e+zyfhx1fY9qcFB5zkYSqu4B/ZgttynDY0s0jxpd1AcLBJgkDi/I+wfAONW+rWY3woNartIMRxPhYRhJviXjvAoKHd4lS4cOTcXXGtPWDg4CUyNlvPgAoYPLhZiszu7kMw+FYLK8uTzbk22P2NGJxgXeB6b3NwakTgZ2eTlo5wreeabzo5TaKXuCXDzw7gWCsFElef3elsXP066BhYFoPR88rhmIR4HS9m0Emw5NSA018qAZNQ7WYsnQaRFWHFEgHkK3nd7Q/EAgWIkHLf4bMPUC8an03yN76Fhs/6hTeBwkSgjWmKzsjIyMjIyJgyer1/cuIO7GzV6ogAAAAASUVORK5CYII="></option>
    </select>
    </td>
    <td>
    <select class="custom-select field-select">
        <option selected>Choose...</option>
    </select>
    </td>
    <td>
    <input
        type="text"
        class="form-control fieldSeperator"
        placeholder="Seperator"
        aria-label="Seperator"
        aria-describedby="basic-addon1"
    />
    </td>
    <td>
    <img class="removeField" alt="Cloud" src="../images/remove.png" />
    </td>
</tr>`;

let saveFieldModal = false;

/**
 * Remove backdrop click
 */
$("#fieldsModel").on("hidden.bs.modal", function () {
  if (!saveFieldModal) {
    // $(".toBeReplacedByActual").remove();
    removeAnyElement($(".toBeReplacedByActual").eq(0));
    console.log($("#drop").children().length);
    if ($("#drop").children().length === 0) {
      // console.log("step 1.5");
      droppableDrop();
    }
  }
  saveFieldModal = false;

  resetForm();
});

/**
 * Images in select
 */
enableImageSelector();
function enableImageSelector() {
  const BASE_URL = "";

  const $_SELECT_PICKER = $(".my-image-selectpicker");

  $_SELECT_PICKER.find("option").each((idx, elem) => {
    const $OPTION = $(elem);
    const IMAGE_URL = $OPTION.attr("data-thumbnail");

    if (IMAGE_URL) {
      $OPTION.attr(
        "data-content",
        "<img style='width: 28px' src='%i'/> %s".replace(/%i/, BASE_URL + IMAGE_URL).replace(/%s/, $OPTION.text())
      );
    }

    // console.warn("option:", idx, $OPTION);
  });

  $_SELECT_PICKER.selectpicker();
}

/**
 * Created allFields from Build panel.
 */
allFields.forEach((item) => {
  $(".field-select").append(`<option value="${item}">${item}</option>`);
});

$(".removeField").click(function (e) {
  if ($(".field-table > tbody > tr").length > 2) $(e.target).parent().parent().remove();
});

$("#addNewField").click(function (e) {
  if ($(".field-table > tbody > tr").length < 8) {
    let trField = $(trFieldString);
    /**
     * Created allFields from Build panel.
     */
    allFields.forEach((item) => {
      trField.find(".field-select").append(`<option value="${item}">${item}</option>`);
    });

    $(".field-table > tbody").append(trField);

    // Diable fiedl if multiline
    if ($("#multiLine:checked").length) {
      $(".fieldSeperator").attr("disabled", "disabled");
    }
    setTimeout(function () {
      $(".removeField").click(function (e) {
        if ($(".field-table > tbody > tr").length > 1) $(e.target).parent().parent().remove();
      });
      enableImageSelector();
    }, 50);
    // disable icon on adding text;
    $(".fieldText").change(function (e) {
      console.log(e.target.value);
      if (e.target.value !== "") {
        $(".my-image-selectpicker").attr("disabled", "disabled");
      } else {
        $(".my-image-selectpicker").removeAttr("disabled");
      }
    });
  }
});

// fieldSeperator;
$("#multiLine").change(function (e) {
  if (e.target.checked) {
    $(".fieldSeperator").attr("disabled", "disabled");
  }
});

// disable icon on adding text;
$(".fieldText").change(function (e) {
  console.log(e.target.value);
  if (e.target.value !== "") {
    $(".my-image-selectpicker").attr("disabled", "disabled");
  } else {
    $(".my-image-selectpicker").removeAttr("disabled");
  }
});

// fieldSeperator;
$("#singleLine").change(function (e) {
  $(".fieldSeperator").removeAttr("disabled");
});

$("#fieldsModelSave").click(function (e) {
  saveFieldModal = true;
  $("#fieldsModel").modal("hide");

  let multiline = false;

  // If multiline
  if ($("#multiLine:checked").length) {
    multiline = true;
  }

  // check how many fields needed
  // let fieldRows = $(".field-table > tbody > tr");
  let container = getNewContainerWE();
  let containerML = getNewContainerNS();
  $(".field-table > tbody > tr").each(function (index) {
    if (multiline) {
      container = getNewContainerWE();
    }

    const fieldText = $(this).find(".fieldText");
    if (fieldText.val().length) {
      let dItem = initDraggedItem(
        $(
          `<span category="textField" style="font-size: 14px; white-space: nowrap;" 
          font-family: Calibri, Arial, sans-serif;>${fieldText.val()}</span>`
        ),
        true
      );
      if (!multiline && fieldText.val().length && index > 0) {
        dItem.find("div.we.west").remove();
      }
      container.find("div.data2:first").append(dItem);
    }

    const icon = $(this).find(".dropdown li.selected.active");
    if (icon.length) {
      let dItem = initDraggedItem(
        $(
          `<img
      class="icon-list drag"
      item="btnIcon"
      src="${icon.find("img").attr("src")}"
    />`
        ),
        true
      );
      if (!multiline && fieldText.val().length) {
        dItem.find("div.we.west").remove();
      }
      container.find("div.data2:first").append(dItem);
    }

    const fieldName = $(this).find(".field-select option:selected").val();
    if (fieldName && fieldName !== "Choose...") {
      let dItem = initDraggedItem(
        $(
          `<span category="textField" style="font-size: 14px; white-space: nowrap;" 
          font-family: Calibri, Arial, sans-serif;>{${fieldName}}</span>`
        ),
        true
      );
      if (!multiline && icon.length) {
        dItem.find("div.we.west").remove();
      }
      container.find("div.data2:first").append(dItem);
    }

    const fieldSeperator = $(this).find(".fieldSeperator");
    if (fieldSeperator.val() && !fieldSeperator.attr("disabled")) {
      let dItem = initDraggedItem(
        $(
          `<span category="textField" style="font-size: 14px; white-space: nowrap;" 
          font-family: Calibri, Arial, sans-serif;>${fieldSeperator.val()}</span>`
        ),
        true
      );
      if (!multiline) {
        dItem.find("div.we.west").remove();
      }
      container.find("div.data2:first").append(dItem);
    }

    if (multiline) {
      if (index > 0) {
        container.find("div.ns.north:first").remove();
      }
      containerML.find("div.data3").append(container);
    }
  });
  if (multiline) {
    $(".toBeReplacedByActual").replaceWith(containerML);
  } else {
    $(".toBeReplacedByActual").replaceWith(container);
  }
  $(".toBeReplacedByActual").removeClass("toBeReplacedByActual");
  // converToTableFunc();
  resetForm();
  // initDraggedItem(draggedItem)

  // remove class .toBeReplacedByActual
});
function resetForm() {
  $(".field-table > tbody > tr").remove();
  $("#addNewField").click();
  $(".fieldSeperator").removeAttr("disabled");
  $("#multiLine").removeAttr("checked");
  $("#singleLine").removeAttr("checked");

  converToTableFunc();
}

function removeAnyElement(item) {
  let itemId = item.attr("id");
  let parentId = item.parent().attr("id");
  const oldItemParent = item.parent();

  $("#" + itemId)
    .closest("div.drag.vertical")
    .remove();

  setTimeout(function () {
    // let canvasParent = ui.draggable.parent();
    // const canvasParentTable = canvasParent.parent().closest("div.drag.vertical").parent();

    /**
     * Add missing ns we
     */
    const childs = oldItemParent.children();
    if (childs.length === 1) {
      const child1st = childs.eq(0);
      addMissingNorthSouth(child1st);
      addMissingEastWest(child1st);
    } else {
      const child1st = childs.eq(0);
      const childlast = childs.eq(childs.length - 1);

      if (oldItemParent.hasClass("data2")) {
        addMissingEastWest(child1st, true, false);
        addMissingEastWest(childlast, false, true);
      } else if (oldItemParent.hasClass("data3")) {
        addMissingNorthSouth(child1st, true, false);
        addMissingNorthSouth(childlast, false, true);
      } else if (parentId === "drop") {
        addMissingNorthSouth(childlast, false, true);
      }
    }

    if ($("#drop").children().length === 0 && parentId === "drop") {
      droppableDrop();
    } else if (
      oldItemParent.children().length === 0 &&
      (oldItemParent.hasClass("data2") || oldItemParent.hasClass("data3"))
    ) {
      oldItemParent.closest("div.drag.vertical").remove();
      if ($("#drop").children().length === 0) {
        droppableDrop();
      }
    }

    setTimeout(function () {
      converToTableFunc();
    }, 200);
  }, 50);
}
