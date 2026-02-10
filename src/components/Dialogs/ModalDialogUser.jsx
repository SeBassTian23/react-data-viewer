import { useState, useRef, useEffect, useCallback } from 'react';

import { useStore, useDispatch } from 'react-redux';

import { useForm } from 'react-hook-form';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { getUserAvatarURL } from '../../utils/user/getUserAvatarURL';
import { getBase64ImageFromURL } from '../../utils/user/getBase64ImageFromURL';

import { useLocalStorage } from "../../hooks/useLocalStorage";
import opfs from '../../modules/opfs'

import useHelp from '../../hooks/useHelp';
import useToast from '../../hooks/useToast'

export default function ModalDialogUser(props) {

  const store = useStore().getState().analysis;
  const refName = useRef();
  const refEmail = useRef();
  const refCookies = useRef();
  const refGravatar = useRef();
  const refDragCounter = useRef(0)
  const fileInput = useRef();

  const [allowCookies, setAllowCookies] = useState(() => localStorage.length > 0)
  const [allowGravatar, setAllowGravatar] = useLocalStorage('APP_USER_GRAVATAR', false);
  
  const [userName, setUserName] = useLocalStorage('APP_USER_NAME', null);
  const [userEmail, setUserEmail] = useLocalStorage('APP_USER_EMAIL', null);
  const [userAvatar, setUserAvatar] = useLocalStorage('APP_USER_AVATAR', null);

  const [isDragging, setIsDragging] = useState(false)
  
  const { register, watch, reset, setValue, getValues } = useForm();
  const dispatch = useDispatch();
  
  const help = useHelp();
  const toast = useToast();
  
  const getGravatar = () => {
    if(getValues('appEmail')?.match(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm) !== null){
      
      const url = getUserAvatarURL( getValues('appEmail'), 200 );

      if(url){
        getBase64ImageFromURL(url).then((base64img) => {setUserAvatar(base64img)}).catch(()=>{
          toast.error('Failed to Fetch your Gravatar', 'Gravatar', 'bi-person-square')
        });
      }
      else{
        toast.error('Failed to Fetch your Gravatar', 'Gravatar', 'bi-person-square')
      }
    }
  }
  
  const handleClose = () => {
    if (allowCookies) {
      setUserName( getValues('appUser') )
      setUserEmail( getValues('appEmail') )
      
      if (allowGravatar) {
        getGravatar();
      }
      
      // dispatch(analysisUpdate({
        //   name: refName.current.value,
        //   notes: refEmail.current.value
        // }))
    }

    // Hide modal dialog
    props.onHide();
  }
    
  useEffect(() => {

    if(allowCookies) {
      // Make sure there is one element in the localStorage
      localStorage.setItem('APP_USER_COOKIES', 1);
      // Request persistant storage
      opfs.isPersistent(true)
      reset();
    }
    
    if (!allowCookies) {      
      setUserName(null);
      setUserEmail(null);
      setUserAvatar(null);
      setAllowGravatar(false);
      
      // final cleanup
      localStorage.clear();
      
      // Remove data from storage
      if( opfs.isSupported() )
        opfs.clearStorage();

      // Reset form
      reset();
    }
    
  }, [allowCookies])

  useEffect(()=>{
    props.setAvatar(userAvatar)
  },[userAvatar])  
  
  useEffect(() => {
    if (allowCookies) {
      setValue('appUser', userName, { shouldTouch: true })
      setValue('appEmail', userEmail, { shouldTouch: true })
    }
  }, [])

  useEffect( ()=>{
    if(allowGravatar)
      getGravatar();
  },[allowGravatar])

  const handleClickDelete = useCallback(()=>{
    setUserAvatar(null)
  },[])

  const handleClickFolder = useCallback(()=>{
    if(fileInput.current)
      fileInput.current.click();
  },[])

  const handleDroppedFile = useCallback((file)=>{
    if (!file || !file.type.startsWith("image/") || !allowCookies || allowGravatar) return;
      const reader = new FileReader();
      reader.onload = () => {
        setUserAvatar(reader.result)
        props.setAvatar(userAvatar);
      }
      reader.readAsDataURL(file);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    refDragCounter.current = 0;
    setIsDragging(false);
    handleDroppedFile(e.dataTransfer.files[0]);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    refDragCounter.current += 1;
    if (refDragCounter.current === 1) {
      setIsDragging(true);
    }
  }

  const onDragLeave = (e) => {
    e.preventDefault();
    refDragCounter.current -= 1;
    if (refDragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const onFileChange = (e) => {
    handleDroppedFile(e.target.files[0]);
  };

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | User Profile", "help/md/profile.md")
  },[] )

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      backdrop="static"
      keyboard={true}
      size={'md'}
      centered
    >
      <Modal.Body>
        <span className='float-end'><Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button></span>
        <span className="d-flex align-items-center fs-4"><i className='bi bi-person-square me-2 fs-2 text-muted' /> Profile</span>
        <Row className='mt-2'>
          <Col className='mt-2 text-center'>
            <div className={`ratio ratio-1x1 img-thumbnail text-center${isDragging? ' bg-light-subtle' : ''}`} style={userAvatar? {background: `url(${userAvatar}) 0% 0% / cover`} : {} }
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
            >
              {!userAvatar && <i className="bi bi-person-bounding-box fs-1 opacity-25 text-muted" style={{ height: 'inherit', marginTop: '30%'}} />}
            </div>
            <ButtonToolbar aria-label="Toolbar with button groups" className='d-flex justify-content-center'>
              <ButtonGroup size='sm' className='mt-1'>
                <Button variant={props.darkmode? "outline-secondary" : "outline-dark"} onClick={handleClickFolder} disabled={(allowGravatar)} className='border-0 rounded-0'><i className='bi bi-folder2-open' /> File</Button>
                <Button variant={props.darkmode? "outline-secondary" : "outline-dark"} onClick={handleClickDelete} disabled={(allowGravatar)} className='border-0 rounded-0'><i className='bi bi-x-circle' /> Delete</Button>
              </ButtonGroup>
            </ButtonToolbar>
            <Form.Control onChange={onFileChange} required type="file" ref={fileInput} multiple={false} accept="image/png, image/webp, image/svg+xml, image/jpeg, image/tiff, image/gif" className='d-none' />
          </Col>
          <Col sm={8}>
            <Form>
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
                  label={<>Remember me <small className='text-muted'>(Allow Cookies)</small></>}
                  checked={allowCookies}
                  onChange={(e) => setAllowCookies(e.target.checked)}
                  ref={refCookies}
                />
                <Form.Check // prettier-ignore
                  type="switch"
                  id="allow-gravatar"
                  label={<>Use Gravatar <small className='text-muted'>(<a href='https://gravatar.com' target='_blank'>gravatar.com</a>)</small></>}
                  checked={allowGravatar}
                  disabled={!allowCookies}
                  onChange={(e) => setAllowGravatar(e.target.checked)}
                  ref={refGravatar}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant="link" className='fs-6 text-decoration-none col-12 m-0 rounded-0 border-end' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
