/**
 * In this file:
 * define cml molecule data for KekuleJS
 * -> need to use '' not "" to load cml format
 */


// A
let cmlDataAcetyl = '<cml xmlns="http://www.xml-cml.org/schema"><molecule id="m1"><atomArray><atom id="a2" elementType="C" x2="7.567486989694215" y2="25.486578125"/><atom id="g1" elementType="R" x2="8.260307312721766" y2="25.086578125000006"/><atom id="a4" elementType="O" x2="7.567486989694212" y2="26.286578125000002"/><atom id="a1" elementType="C" x2="6.874666666666666" y2="25.086578125"/></atomArray><bondArray><bond id="b2" order="S" atomRefs2="a2 g1"/><bond id="b3" order="D" atomRefs2="a2 a4"/><bond id="b1" order="S" atomRefs2="a2 a1"/></bondArray></molecule></cml>';

// B
// C
// D
// E
// F
// G
// H
// I
// J
// K
// L
// M
// N
// O
let cmlDataOctanoyl = '<cml xmlns="http://www.xml-cml.org/schema"><molecule id="m1"><atomArray><atom id="a1" elementType="C" x2="7.706666666666665" y2="42.04657779947917"/><atom id="a2" elementType="C" x2="7.01384634363912" y2="42.446577799479165"/><atom id="g1" elementType="R" x2="8.399486989694212" y2="42.446577799479165"/><atom id="a9" elementType="O" x2="7.706666666666665" y2="41.24657779947917"/><atom id="a3" elementType="C" x2="6.321026020611567" y2="42.04657779947917"/><atom id="a4" elementType="C" x2="5.628205697584017" y2="42.446577799479165"/><atom id="a5" elementType="C" x2="4.935385374556465" y2="42.04657779947917"/><atom id="a6" elementType="C" x2="4.242565051528915" y2="42.446577799479165"/><atom id="a7" elementType="C" x2="3.5497447285013664" y2="42.04657779947917"/><atom id="a8" elementType="C" x2="2.8569244054738174" y2="42.446577799479165"/></atomArray><bondArray><bond id="b2" order="S" atomRefs2="a1 a2"/><bond id="b1" order="S" atomRefs2="a1 g1"/><bond id="b9" order="D" atomRefs2="a1 a9"/><bond id="b3" order="S" atomRefs2="a2 a3"/><bond id="b4" order="S" atomRefs2="a3 a4"/><bond id="b5" order="S" atomRefs2="a4 a5"/><bond id="b6" order="S" atomRefs2="a5 a6"/><bond id="b7" order="S" atomRefs2="a6 a7"/><bond id="b8" order="S" atomRefs2="a7 a8"/></bondArray></molecule></cml>';
// P
// Q
// R
// S
// T
// U
// V
// W
// X
// Y
// Z

let moleculesLib = {
    // A:
    Acetyl: '<cml xmlns="http://www.xml-cml.org/schema"><molecule id="m1"><atomArray><atom id="a2" elementType="C" x2="7.567486989694215" y2="25.486578125"/><atom id="g1" elementType="R" x2="8.260307312721766" y2="25.086578125000006"/><atom id="a4" elementType="O" x2="7.567486989694212" y2="26.286578125000002"/><atom id="a1" elementType="C" x2="6.874666666666666" y2="25.086578125"/></atomArray><bondArray><bond id="b2" order="S" atomRefs2="a2 g1"/><bond id="b3" order="D" atomRefs2="a2 a4"/><bond id="b1" order="S" atomRefs2="a2 a1"/></bondArray></molecule></cml>',
    // B:
    // C:
    // ...
    // O:
    Octanoyl: '<cml xmlns="http://www.xml-cml.org/schema"><molecule id="m1"><atomArray><atom id="a1" elementType="C" x2="7.706666666666665" y2="42.04657779947917"/><atom id="a2" elementType="C" x2="7.01384634363912" y2="42.446577799479165"/><atom id="g1" elementType="R" x2="8.399486989694212" y2="42.446577799479165"/><atom id="a9" elementType="O" x2="7.706666666666665" y2="41.24657779947917"/><atom id="a3" elementType="C" x2="6.321026020611567" y2="42.04657779947917"/><atom id="a4" elementType="C" x2="5.628205697584017" y2="42.446577799479165"/><atom id="a5" elementType="C" x2="4.935385374556465" y2="42.04657779947917"/><atom id="a6" elementType="C" x2="4.242565051528915" y2="42.446577799479165"/><atom id="a7" elementType="C" x2="3.5497447285013664" y2="42.04657779947917"/><atom id="a8" elementType="C" x2="2.8569244054738174" y2="42.446577799479165"/></atomArray><bondArray><bond id="b2" order="S" atomRefs2="a1 a2"/><bond id="b1" order="S" atomRefs2="a1 g1"/><bond id="b9" order="D" atomRefs2="a1 a9"/><bond id="b3" order="S" atomRefs2="a2 a3"/><bond id="b4" order="S" atomRefs2="a3 a4"/><bond id="b5" order="S" atomRefs2="a4 a5"/><bond id="b6" order="S" atomRefs2="a5 a6"/><bond id="b7" order="S" atomRefs2="a6 a7"/><bond id="b8" order="S" atomRefs2="a7 a8"/></bondArray></molecule></cml>',
}