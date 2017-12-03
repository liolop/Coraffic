#Intermediate Play

```blocks
loops.forever(function () {
    for (let index = 0; index <= 7; index++) {
        intersections.setDirAtInter(TLDir.NS, index)
    }
    if (status.getCarsWait(TLDir.EW, 0) >= 2) {
        intersections.setDirAtInter(TLDir.EW, 0)
    }
    if (2 <= status.getCarsWait(TLDir.EW, 1)) {
        intersections.setDirAtInter(TLDir.EW, 1)
    }
    if (status.getCarsWait(TLDir.EW, 2) >= 2) {
        intersections.setDirAtInter(TLDir.EW, 2)
    }
    if (2 <= status.getCarsWait(TLDir.EW, 3)) {
        intersections.setDirAtInter(TLDir.EW, 3)
    }
    if (status.getCarsWait(TLDir.EW, 4) >= 2) {
        intersections.setDirAtInter(TLDir.EW, 4)
    }
    if (2 <= status.getCarsWait(TLDir.EW, 5)) {
        intersections.setDirAtInter(TLDir.EW, 5)
    }
    if (status.getCarsWait(TLDir.EW, 6) >= 2) {
        intersections.setDirAtInter(TLDir.EW, 6)
    }
    if (2 <= status.getCarsWait(TLDir.EW, 7)) {
        intersections.setDirAtInter(TLDir.EW, 7)
    }
})
```