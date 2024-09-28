
/**
 * Calculate LMS Product Totals
 * @param  object products
 * @param  string findKey
 * @param  string what
 * @param  string type
 * @param  string prefixBefore
 * @param  string prefixAfter
 * @return float
 */
 export default function LmsSumProductTotals(
    products,
    findKey = '',
    what = 'totals', 
    type = 'round', 
    prefixBefore = '', 
    prefixAfter = ''){  
    let calcTotal = 0;

    let castProducts = Array.isArray(products) ? products : Array.from(products);
    
    if(castProducts.length > 0){
        castProducts.forEach((product, index) => {
            if( product[findKey] !== undefined && product[findKey] !== 0 ){
                calcTotal = calcTotal + parseFloat(product[findKey]);
            }else{
                calcTotal = 0;
            }
        })
    }

    if(calcTotal > 0){
        if(type === 'decimals'){
            calcTotal = parseFloat(calcTotal).toFixed(1);
        }else{
            calcTotal = Math.round(calcTotal);
        }
        return prefixBefore + calcTotal + prefixAfter;
    }else{
        return 0;
    }
  
}