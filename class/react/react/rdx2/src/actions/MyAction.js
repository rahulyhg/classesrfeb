export const getNearbyLocationFromServer = (lat, lng) => {
  const url = 'http://api.mkgalaxy.com/api.php?action=nearby&lat='+lat+'&lng='+lng;

  return {
    type: 'CALL_NEARBY',
    payload: new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET'
      }).then((response) => {
        return response.json();
      }).then((j) => {
        console.log('j is ', j);
        resolve(j.data);
      }).catch((err) => {
        console.log('error is ', err);
        reject(err);
      });
    })
  }
};

export const startLoading = () => {
  return {
    type: 'CALL_LOADING',
    payload: true
  }
}