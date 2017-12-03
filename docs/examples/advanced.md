#Advanced Play

```blocks
loops.forever(function () {
    for (let index = 0; index <= 7; index++) {
        if (status.getCarsWait(TLDir.NS, index) > 1) {
            intersections.setDirAtInter(TLDir.NS, index)
        } else if (status.getCarsWait(TLDir.EW, index) >= 1) {
            intersections.setDirAtInter(TLDir.EW, index)
        } else if (status.getDirection(index) == status.locParam(TLDir.NS)) {
            intersections.setDirAtInter(TLDir.EW, index)
        } else if (status.getDuration(status.randIndex()) >= 2) {
            intersections.setDirAtInter(TLDir.NS, status.randIndex())
        }
    }
})
```