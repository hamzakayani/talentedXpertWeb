import axios from 'axios';

export const setAxiosHeaders = () => {
  if (typeof window !== 'undefined') {  // Check if we're in the browser
    const token = localStorage?.getItem("accessToken");
    const profileType = localStorage?.getItem("profileType");

    console.log(profileType)
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    if (profileType) {
      axios.defaults.headers.common["profileType"] = profileType;
    } else {
      delete axios.defaults.headers.common["profileType"];
    }
  }
};

setAxiosHeaders();

export default axios;
