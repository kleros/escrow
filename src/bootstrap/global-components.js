import React, { PureComponent } from 'react'
import ReactTooltip from 'react-tooltip'
import ReduxToastr from 'react-redux-toastr'

export default class GlobalComponents extends PureComponent {
  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  render() {
    return (
      <div>
        <ReactTooltip />
        <ReduxToastr
          timeOut={0}
          position="top-center"
          transitionIn="bounceInDown"
          transitionOut="bounceOutUp"
          progressBar
        />
      </div>
    )
  }
}
