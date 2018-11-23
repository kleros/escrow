import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const NewEvidenceArbitrableTx = ({ submitEvidence, id }) => (
  <div>
    <h1>Create Evidence</h1>
    <Formik
      initialValues={{name: '', description: '', file: ''}}
      validate = {values => {
        {/* TODO use Yup */}
      }}
      onSubmit={evidence => submitEvidence(evidence, id)}
    >
      {({ setFieldValue }) => (
        <Form>
          <Field name='name' placeholder='name' />
          <ErrorMessage name='name' component='div' />

          <Field type='textarea' name='description' />
          <ErrorMessage name='description' component='div' className='def' />

          {/* hack Formik for file type */}
          {/* and store only the path on the file in the redux state */}
          <input id='file' name='file' type='file' onChange={e =>
            setFieldValue('file', window.URL.createObjectURL(e.currentTarget.files[0]))
          } />
          <button type='submit'>
            Save Evidence
          </button>
        </Form>
      )}
    </Formik>
  </div>
)

NewEvidenceArbitrableTx.propTypes = {
  // State
  formArbitrabletx: PropTypes.func
}

NewEvidenceArbitrableTx.defaultProps = {
  // State
  formArbitrabletx: v => v
}

export default NewEvidenceArbitrableTx
