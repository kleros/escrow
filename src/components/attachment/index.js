import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import Modal from 'react-responsive-modal'
import Linkify from 'linkifyjs/react'

import { ReactComponent as Document } from '../../assets/primary-document.svg'
import { ReactComponent as Image } from '../../assets/image.svg'
import { ReactComponent as Link } from '../../assets/link.svg'
import { ReactComponent as Video } from '../../assets/video.svg'

import isImage from 'is-image'
import isTextPath from 'is-text-path'
import isVideo from 'is-video'

import './attachment.css'

const Attachment = ({ URI, title, description }) => {
  const [open, setModal] = useState(false)
  let Component
  if (isTextPath(URI)) Component = Document
  else if (isImage(URI)) Component = Image
  else if (isVideo(URI)) Component = Video
  else Component = Link
  return (
    <div className='Attachment'>
      <ReactTooltip html={true} place="bottom" type="dark" effect="solid" data-multiline={true} />
      {URI.split('.').pop() !== '' ? (
        <a
          href={URI.replace(/^\/ipfs\//, 'https://ipfs.kleros.io/ipfs/')}
          rel="noopener noreferrer"
          target="_blank"
          className="Attachment"
        >
          <Component data-tip={`<h2 class='Attachment-title'>${title}</h2><p class='Attachment-description'>${description}</p>`} />
        </a>
      ) : (
        <>
          <Component className='Attachment-component-link' onClick={() => setModal(!open)} data-tip={`<h2 class='Attachment-title'>${title}</h2><p class='Attachment-description'>${description}</p>`} />
          <Modal 
            open={open} 
            onClose={() => setModal(!open)} 
            center
            classNames={{
              modal: 'Attachment-modal',
            }}
          >
            <h2 className='Attachment-modal-title'>{title}</h2>
            <Linkify>
              <p className='Attachment-modal-description'>{description}</p>
            </Linkify>
          </Modal>
        </>
      )}
    </div>
  )
}

Attachment.propTypes = {
  URI: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  extension: PropTypes.string
}

Attachment.defaultProps = {
  extension: null
}

export default Attachment