import React from 'react'
import PropTypes from 'prop-types'
import Countdown from 'react-countdown-now'
import { Formik, Form } from 'formik'

import Button from '../button'

const TimeoutArbitrableTx = ({ id, timeout, time, name }) => (
  <React.Fragment>
    <div style={{color: 'red', fontWeight: 'bold', fontSize: '0.9em'}}>Timeout</div>
    <div style={{color: 'red', fontWeight: 'bold', fontSize: '1.2em', paddingBottom: '10px'}}><Countdown date={time} /></div>
    <Formik onSubmit={() => timeout(id)}>
      {({isSubmitting}) => (
        <Form className={'PayOrReimburseArbitrableTx'}>
          <Button type='submit' disabled={isSubmitting || time - Date.now() > 0}>
            {name}
          </Button>
        </Form>
      )}
    </Formik>
  </React.Fragment>
)

TimeoutArbitrableTx.propTypes = {
  // State
  timeout: PropTypes.func,
  id: PropTypes.string
}

TimeoutArbitrableTx.defaultProps = {
  // State
  timeout: v => v,
  id: ''
}

export default TimeoutArbitrableTx
