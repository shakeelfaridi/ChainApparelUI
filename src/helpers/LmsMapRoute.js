
// ROUTES
import { PATH_DASHBOARD } from '../routes/paths';

/**
 * Lms Map Routing
 * @param  id id
 * @param  id locid
 * @param  id targetid
 * @param  id prodid
 */
 export default function LmsMapRoute(
    id,
    locid,
    targetid,
    prodid){
  
    if(id && locid && targetid && prodid){
        return PATH_DASHBOARD.stats.lmsViewLocProd(id, locid, targetid, prodid);
    }else if(id && locid && targetid){
        return PATH_DASHBOARD.stats.lmsViewLocAud(id, locid, targetid); 
    }else if(id && locid){
        return PATH_DASHBOARD.stats.lmsViewLoc(id, locid); 
    }else{
        return PATH_DASHBOARD.stats.lmsView(id); 
    }
}