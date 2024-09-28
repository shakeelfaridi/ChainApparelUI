
/**
 * Calculate LMS Single Totals
 * @param  float total
 * @param  float calc
 * @param  string what
 * @param  string type
 * @param  string prefixBefore
 * @param  string prefixAfter
 * @return float
 */
export default function LmsSingletotals(
    total, 
    calc,
    what = 'totals', 
    type = 'round', 
    prefixBefore = '', 
    prefixAfter = ''){
  
    let calcTotal = 0;

    if(total && calc){
      switch(what){
        case 'average':
          if(type === 'decimals'){
            calcTotal = parseFloat(parseFloat(total) / parseFloat(calc)).toFixed(1);
          }else{
            calcTotal =  Math.round(parseFloat(total) / parseFloat(calc));
          }
          break;
        default:
          if(type === 'decimals'){
            calcTotal = parseFloat(parseFloat(calc) / parseFloat(total) * 100).toFixed(1);
          }else{
            calcTotal = Math.round(parseFloat(calc) / parseFloat(total) * 100);
          }
      }
    }

    return  prefixBefore + calcTotal + prefixAfter;
}