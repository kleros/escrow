import React from 'react'
import PropTypes from 'prop-types'
import Countdown from 'react-countdown-now'
import { Formik, Form } from 'formik'
import { ClipLoader } from 'react-spinners'

import Button from '../button'

const TimeoutArbitrableTx = ({ arbitrable, id, timeout, time, name }) => (
  <React.Fragment>
    <div style={{color: 'red', fontWeight: 'bold', fontSize: '0.9em'}}>Timeout</div>
    <div style={{color: 'red', fontWeight: 'bold', fontSize: '1.2em', paddingBottom: '10px'}}><Countdown date={time} /></div>
    <Formik onSubmit={() => timeout(arbitrable, id)}>
      {({isSubmitting}) => (
        <Form className={'PayOrReimburseArbitrableTx'}>
          <Button type='submit' disabled={isSubmitting || time - Date.now() > 0}>
            <>{isSubmitting && <span style={{position: 'relative', top: '4px', lineHeight: '40px', paddingRight: '4px'}}><ClipLoader size={20} color={'#fff'} /></span>} {name}</>
          </Button>
        </Form>
      )}
    </Formik>
  </React.Fragment>
)

TimeoutArbitrableTx.propTypes = {
  // State
  arbitrable: PropTypes.string,
  id: PropTypes.string,
  timeout: PropTypes.func
}

TimeoutArbitrableTx.defaultProps = {
  // State
  arbitrable: '',
  id: '',
  timeout: v => v
}

export default TimeoutArbitrableTx
