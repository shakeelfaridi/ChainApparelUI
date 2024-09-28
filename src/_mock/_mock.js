import { sub } from 'date-fns';
//
import { role } from './role';
import { email } from './email';
import { boolean } from './boolean';
import { company } from './company';
import { phoneNumber } from './phoneNumber';
import { fullAddress, country } from './address';
import { firstName, lastName, fullName } from './name';
import { title, sentence, description } from './text';
import { price, rating, age, percent } from './number';
import { lastLogin } from './lastLogin';
import { branch } from './branch';
import { targetAudience } from './targetAudience';
import { registrations } from './registrations';
import { zohoID } from './zohoID';
import { trialTypes } from './trialTypes';
import { trialsActivated } from './trialsActivated';
import { trialsStudents } from './trialsStudents';
import { trialsCourses } from './trialsCourses';
import { bannersTitles } from './bannersTitles';
import { bannerStatus } from './bannerStatus';
import { visibility } from './visibility';
import { productsCourses } from './productsCourses';
import { linkStatus } from './linkStatus';
import { quality } from './quality';
import { course } from './course';
import { lmsCompanies } from './lmsCompanies';
import { lmsProducts } from './lmsProducts';
import { lmsManagers } from './lmsManagers';
import { lmsBranch } from './lmsBranch';
import { lmsLocations } from './lmsLocations';


// ----------------------------------------------------------------------

const _mock = {
  id: (index) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,
  email: (index) => email[index],
  phoneNumber: (index) => phoneNumber[index],
  time: (index) => sub(new Date(), { days: index, hours: index }),
  boolean: (index) => boolean[index],
  role: (index) => role[index],
  company: (index) => company[index],
  lastLogin: (index) => lastLogin[index],
  branch: (index) => branch[index],
  targetAudience: (index) => targetAudience[index],
  registrations: (index) => registrations[index],
  zohoID: (index) => zohoID[index],
  trialTypes: (index) => trialTypes[index],
  trialsActivated: (index) => trialsActivated[index],
  trialsStudents: (index) => trialsStudents[index],
  trialsCourses: (index) => trialsCourses[index],
  bannersTitle: (index) => bannersTitles[index],
  bannerStatus: (index) => bannerStatus[index],
  visibility: (index) => visibility[index],
  products: (index) => productsCourses[index],
  linkStatus: (index) => linkStatus[index],
  quality: (index) => quality[index],
  course: (index) => course[index],
  lmsCompanies: (index) => lmsCompanies[index],
  lmsProducts: (index) => lmsProducts[index],
  lmsManagers: (index) => lmsManagers[index],
  lmsBranch: (index) => lmsBranch[index],
  lmsLocations: (index) => lmsLocations[index],
  address: {
    fullAddress: (index) => fullAddress[index],
    country: (index) => country[index],
  },
  name: {
    firstName: (index) => firstName[index],
    lastName: (index) => lastName[index],
    fullName: (index) => fullName[index],
  },
  text: {
    title: (index) => title[index],
    sentence: (index) => sentence[index],
    description: (index) => description[index],
  },
  number: {
    percent: (index) => percent[index],
    rating: (index) => rating[index],
    age: (index) => age[index],
    price: (index) => price[index],
  },
  image: {
    cover: (index) => `https://minimal-assets-api-dev.vercel.app/assets/images/covers/cover_${index + 1}.jpg`,
    feed: (index) => `https://minimal-assets-api-dev.vercel.app/assets/images/feeds/feed_${index + 1}.jpg`,
    product: (index) => `https://minimal-assets-api-dev.vercel.app/assets/images/products/product_${index + 1}.jpg`,
    avatar: (index) => `https://minimal-assets-api-dev.vercel.app/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
};

export default _mock;
