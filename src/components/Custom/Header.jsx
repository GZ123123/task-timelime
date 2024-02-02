import types from 'prop-types'

export const Header = (props) => {

  return (
    <div {...props.getIntervalProps({})} className="custom-header">{ (() => {
      const date = props.intervalContext.intervalText.match(/.{1,4}/g);
    
      return date.map((text) => <span key={text}>{text}</span>)
    })() }</div>
  )
}

Header.propTypes = {
  getIntervalProps: types.any,
  intervalContext: types.any
}