import { useState, useRef, useEffect } from 'react';

import { useStore, useDispatch } from 'react-redux';

import { useForm } from 'react-hook-form';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import { getUserAvatarURL } from '../../utils/user/getUserAvatarURL';
import { getBase64ImageFromURL } from '../../utils/user/getBase64ImageFromURL';

import { useLocalStorage } from "../../hooks/useLocalStorage";

import HelpOffCanvas from '../Main/HelpOffCanvas';

export default function ModalDialogUser(props) {

  const store = useStore().getState().analysis;
  const refName = useRef();
  const refEmail = useRef();

  const [allowCookies, setAllowCookies] = useState(() => localStorage.length > 0)
  const [allowGravatar, setAllowGravatar] = useLocalStorage('APP_USER_GRAVATAR', false, false);

  const [userName, setUserName] = useLocalStorage('APP_USER_NAME', '', false);
  const [userEmail, setUserEmail] = useLocalStorage('APP_USER_EMAIL', '', false);

  const { register, watch, reset, setValue, getValues } = useForm();
  const dispatch = useDispatch();

  const handleClose = () => {
    if (allowCookies) {
      localStorage.setItem('APP_USER_NAME', getValues('appUser'));
      localStorage.setItem('APP_USER_EMAIL', getValues('appEmail'));
      // dispatch(analysisUpdate({
      //   name: refName.current.value,
      //   notes: refEmail.current.value
      // }))
    }
    props.onHide();
  }

  useEffect(() => {

    if (!allowCookies) {
      localStorage.clear();
      props.setAvatar(false);
      setAllowGravatar(false);
      reset();
    }

    if (allowCookies && !allowGravatar) {
      localStorage.setItem('APP_USER_GRAVATAR',false)
      localStorage.setItem('APP_USER_AVATAR',null)
      props.setAvatar(null)
    }

    if (allowCookies && allowGravatar) {
      localStorage.setItem('APP_USER_GRAVATAR',true);
      let img = localStorage.getItem('APP_USER_AVATAR');

      if(img === null || img == 'null' && getValues('appEmail')?.match(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm) !== null){
                
        let url = getUserAvatarURL( getValues('appEmail') );
        
        getBase64ImageFromURL(url).then((base64img) => {
          localStorage.setItem('APP_USER_AVATAR', base64img)
          props.setAvatar(base64img)
        }).catch(()=>{
          localStorage.setItem('APP_USER_AVATAR', null);
        });
      }

      else if(img !== null && img != 'null') {
        props.setAvatar(img)
      }
    }

  }, [allowCookies, allowGravatar, props.avatar])


  useEffect(() => {
    if (allowCookies) {
      setValue('appUser', userName, { shouldTouch: true })
      setValue('appEmail', userEmail, { shouldTouch: true })
    }
  }, [])

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      backdrop="static"
      keyboard={true}
      size={'sm'}
      centered
    >
      <Modal.Body>
        <span className='float-end'><HelpOffCanvas title='Help | User Profile' url='help/md/profile.md' /></span>
        <span className="d-block fs-4">{props.avatar ? <img src={props.avatar} className='rounded title-avatar' /> : <i className="bi bi bi-person-circle fs-2 text-muted" /> } Profile</span>
        <Form className='mt-2'>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control ref={refName} type="text" {...register("appUser")} placeholder="My Name" defaultValue='' disabled={!allowCookies} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control ref={refEmail} type="email" {...register("appEmail")} placeholder="email@domain.org" defaultValue='' disabled={!allowCookies} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check // prettier-ignore
              type="switch"
              id="allow-cookies"
              label={<>Remember me <small className='text-muted'>(Cookies)</small></>}
              checked={allowCookies}
              onChange={() => setAllowCookies(e => !e)}
            />
            <Form.Check // prettier-ignore
              type="switch"
              id="allow-gravatar"
              label={<>Avatar <small className='text-muted'>(from <a href='https://gravatar.com' target='_blank'>gravatar.com</a>)</small></>}
              checked={allowGravatar}
              disabled={!allowCookies}
              onChange={() => setAllowGravatar(e => !e)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant="link" className='fs-6 text-decoration-none col-12 m-0 rounded-0 border-end' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
