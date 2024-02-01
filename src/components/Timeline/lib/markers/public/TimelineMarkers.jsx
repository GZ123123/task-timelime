import PropTypes from 'prop-types'

// If we decide to pass in props to TimelineMarkers, then yes, this is necessary.
const TimelineMarkers = props => {
  return props.children || null
}

TimelineMarkers.propTypes = {
  children: PropTypes.func
}

export default TimelineMarkers
