import React, { createContext } from 'react'
import PropTypes from 'prop-types'

const defaultContextState = {

}

const {Consumer, Provider} = createContext(defaultContextState)

export class ScrollElementProvider extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    onCreateItem: PropTypes.func.isRequired,
    onResizing: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      item: null,
      scrollElementContext: {
        selectGroup: this.selectGroup,
        handleCreateItem: this.handleCreateItem,
        handleResizingItem: this.handleResizingItem
      }
    }
  }

  selectGroup = (group) => {
    this.setState({ ...this.state, group })
  }

  handleCreateItem = (timeStart, timeEnd) => {
    if(this.state.group) {
      const item = this.props.onCreateItem(this.state.group, timeStart, timeEnd)

      this.setState({ item })
    }
  }

  handleResizingItem = (resizeTime) => {
    // console.log('log - ScrollContext - resize: ', resizeTime)

    if (!this.state.item) return;

    this.props.onResizing(this.state.item.id, resizeTime, 'right')
  }

  render() {
    return (
      <Provider value={{ item: this.state.item, ...this.state.scrollElementContext }}>
        {this.props.children}
      </Provider>
    )
  }
}

export const ScrollElementConsumer = Consumer