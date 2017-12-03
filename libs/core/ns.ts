/**
 * Traffic Control
 */
//% color=#21A1F9 icon="\uf018" weight=90
namespace intersections {

}

/**
 * Traffic Variables
 */
//% color=#DA5F0F icon="\uf1b9" weight=80
namespace status{

}

/**
 * Traffic Events
 */
//% color=#8440E6 icon="\uf13a" weight=95
namespace events{

}

/**
 * Engine Rendering
 */
loops.forever(()=>{
    if(true){
        events.detectCarInter();
    }
});
