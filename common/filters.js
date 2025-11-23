import moment from 'moment';

function filterDate(input, formatter) {
  if (!input) {
    return null;
  }
  if (!formatter) {
    // eslint-disable-next-line
    formatter = 'YYYY-MM-DD';
  }
  // eslint-disable-next-line
  formatter = formatter.replace(/\yyyy/g, 'YYYY');

  return moment(input).format(formatter);
}

export default {
  filterDate,
};
