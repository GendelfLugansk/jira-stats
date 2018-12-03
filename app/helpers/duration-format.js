import { helper } from '@ember/component/helper';
import moment from 'npm:moment-timezone';
import momentDurationFormatSetup from 'npm:moment-duration-format';

momentDurationFormatSetup(moment);

function durationFormat(
  [duration],
  {
    durationMultiplier = 1000,
    format = 'dd[d] hh[h] mm[m] ss[s]',
    trim = 'both',
    coordinated = false,
  } = {}
) {
  if (coordinated) {
    const formatted = moment.duration.format(
      [
        moment.duration(duration * durationMultiplier),
        moment.duration(coordinated),
      ],
      String(format),
      {
        trim,
      }
    );
    return formatted[0];
  } else {
    return moment
      .duration(duration * durationMultiplier)
      .format(String(format), { trim });
  }
}

export default helper(durationFormat);
