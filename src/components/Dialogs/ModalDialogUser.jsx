import { useState, useRef, useEffect, useCallback } from 'react';

import { useStore, useDispatch } from 'react-redux';

import { useForm } from 'react-hook-form';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import { getUserAvatarURL } from '../../utils/user/getUserAvatarURL';
import { getBase64ImageFromURL } from '../../utils/user/getBase64ImageFromURL';

import { useLocalStorage } from "../../hooks/useLocalStorage";
import opfs from '../../modules/opfs'

import useHelp from '../../hooks/useHelp';

export default function ModalDialogUser(props) {

  const store = useStore().getState().analysis;
  const refName = useRef();
  const refEmail = useRef();

  const [allowCookies, setAllowCookies] = useState(() => localStorage.length > 0)
  const [allowGravatar, setAllowGravatar] = useLocalStorage('APP_USER_GRAVATAR', '', false);

  const [userName, setUserName] = useLocalStorage('APP_USER_NAME', '', false);
  const [userEmail, setUserEmail] = useLocalStorage('APP_USER_EMAIL', '', false);

  const { register, watch, reset, setValue, getValues } = useForm();
  const dispatch = useDispatch();

  const help = useHelp();

  const setAvatar = () => {
    localStorage.setItem('APP_USER_GRAVATAR', true);
    let img = localStorage.getItem('APP_USER_AVATAR');

    if(img == '' && getValues('appEmail')?.match(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm) !== null){
              
      let url = getUserAvatarURL( getValues('appEmail') );
      
      getBase64ImageFromURL(url).then((base64img) => {
        localStorage.setItem('APP_USER_AVATAR', base64img)
        props.setAvatar(base64img)
      }).catch(()=>{
        localStorage.setItem('APP_USER_AVATAR', '');
      });
    }

    else if( img.startsWith('data:image') ) {
      props.setAvatar(img)
    }
  }

  const handleClose = () => {
    if (allowCookies) {
      localStorage.setItem('APP_USER_NAME', getValues('appUser'));
      localStorage.setItem('APP_USER_EMAIL', getValues('appEmail'));

    if (allowCookies && allowGravatar) {
      setAvatar();
    }

      // dispatch(analysisUpdate({
      //   name: refName.current.value,
      //   notes: refEmail.current.value
      // }))
    }
    props.onHide();
  }

  useEffect(() => {

    if (!allowCookies) {
      // Remove data from storage
      localStorage.clear();
      props.setAvatar(false);
      setAllowGravatar(false);
      if( opfs.isSupported() )
        opfs.clearStorage();
      // Reset form
      reset();
    }

    if (allowCookies && !allowGravatar) {
      localStorage.setItem('APP_USER_GRAVATAR',false)
      localStorage.setItem('APP_USER_AVATAR', '')
      props.setAvatar(null)
    }

    if (allowCookies && allowGravatar) {
      setAvatar();
    }

  }, [allowCookies, allowGravatar, props.avatar])


  useEffect(() => {
    if (allowCookies) {
      setValue('appUser', userName, { shouldTouch: true })
      setValue('appEmail', userEmail, { shouldTouch: true })
    }
  }, [])

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | User Profile", "help/md/profile.md")
  },[] )

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
        <span className='float-end'><Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button></span>
        <span className="d-flex align-items-center fs-4">{props.avatar ? <img src={props.avatar} className='rounded title-avatar me-2' /> : <i className="bi bi-person-circle me-2 fs-2 text-muted" /> } Profile</span>
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
