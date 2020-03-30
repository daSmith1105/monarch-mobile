'use-strict';

const checkIsAlive = (timestamp) => {
  const bTimeDiffMax = 36000;
  const oDate = new Date();
  const bNow = parseInt( oDate.getTime() / 1000 );
  const transformTimestamp = new Date(timestamp);
  const bTimestamp = parseInt( transformTimestamp.getTime() / 1000);

  return bTimeDiffMax > (( bNow - bTimestamp ) / 1000)
};


export default checkIsAlive;