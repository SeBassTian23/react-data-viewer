import { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { getUserAvatarURL } from '../../utils/user/getUserAvatarURL';
import { getBase64ImageFromURL } from '../../utils/user/getBase64ImageFromURL';

import opfs from '../../modules/opfs'

import { updateProfile } from '../../features/user.slice'

import {ColorSchemeDropDown} from '../Main/ColorScheme'

import useHelp from '../../hooks/useHelp';
import useToast from '../../hooks/useToast'

export default function ModalDialogUser(props) {

  const profile = useSelector(state => state.user);

  const refName = useRef();
  const refEmail = useRef();
  const refCookies = useRef();
  const refGravatar = useRef();
  const refColorScheme = useRef(profile.colorScheme);
  const refTheme = useRef();
  const refDragCounter = useRef(0)
  const fileInput = useRef();
  
  const [isDragging, setIsDragging] = useState(false)
    
  const help = useHelp();
  const toast = useToast();
  const dispatch = useDispatch();
  
  const getGravatar = () => {
    const email = refEmail?.current?.value || ""
    if(email?.match(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm) !== null){
      
      const url = getUserAvatarURL( email, 200 );

      if(url){
        getBase64ImageFromURL(url).then((base64img) => {
          dispatch(updateProfile({avatar: base64img}))
        }).catch(()=>{
          toast.error('Failed to Fetch your Gravatar', 'Gravatar', 'bi-person-square')
        });
      }
      else{
        toast.error('Failed to Fetch your Gravatar', 'Gravatar', 'bi-person-square')
      }
    }
  }
  
  const handleClose = () => {
    dispatch(updateProfile({
      allowCookies: refCookies?.current?.checked,
      avatar: profile.avatar || null,
      colorScheme: refColorScheme.current || 'default',
      email: refEmail?.current?.value || "",
      enableGravatar: refGravatar?.current?.checked,
      name: refName?.current?.value || "",
    }));

    // Hide modal dialog
    props.onHide();
  }

  const handleClickDelete = useCallback(()=>{
    dispatch(updateProfile({
      avatar: null
    }));
  },[])

  const handleClickFolder = useCallback(()=>{
    if(fileInput.current)
      fileInput.current.click();
  },[])

  const handleDroppedFile = useCallback((file)=> {
    if (!file || !file.type.startsWith("image/") || !profile.allowCookies || profile.enableGravatar) return;
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(updateProfile({avatar: reader.result}))
      }
      reader.readAsDataURL(file);
  }, [profile.allowCookies,profile.enableGravatar]);

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

  const handleCookieSwitch = (e) => {
    if(e.target.checked){
      // Activate Storage
      localStorage.setItem('APP_USER_COOKIES',1)
      // Update State
      dispatch(updateProfile({allowCookies: true}))
      // Request persistant storage
      opfs.isPersistent(true)
    }
    else{
      // "Deactivate" Storage
      localStorage.removeItem('APP_USER_COOKIES')
      // Update State
      dispatch(updateProfile({allowCookies: false}))
      // Remove data from storage
      if( opfs.isSupported() )
        opfs.clearStorage();
    }
  }

  const handleGravatarSwitch = (e) => {
    if(e.target.checked){
      dispatch(updateProfile({enableGravatar: true}))
      getGravatar();
    }
    else{
      dispatch(updateProfile({enableGravatar: false}))
    }
  }

  const handleChangeTheme = useCallback(() => {

    if(refTheme.current){
      let mode = refTheme.current?.value || 'system'

      props.setdarkmode(mode)
      dispatch(updateProfile({darkmode: mode}))
    }

  }, [props.setDarkmode, props.darkmode]);

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
        <span className="d-flex align-items-center fs-5">
          <i className="bi bi-person-square me-2 fs-3 text-muted" /> Profile
          <Button variant={null} onClick={handleClickHelp} className='ms-auto'><i className='bi bi-question-circle' /></Button>
        </span>

        <Row className='mt-2'>
          <Col className='mt-2 text-center'>
            <div className={`ratio ratio-1x1 img-thumbnail${isDragging? ' bg-light-subtle' : ''}`} style={profile.avatar? {background: `url(${profile.avatar}) 0% 0% / cover`} : {} }
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
            >
              {!profile.avatar && <div className="text-center text-muted">
                <i className="bi bi-person-bounding-box fs-1 opacity-25 d-block" style={{marginTop: '30%'}}/>
                <span className="d-block" style={{fontSize: 'x-small'}}>
                  Drag image here
                </span>
              </div>}
            </div>
            <ButtonToolbar aria-label="Toolbar with button groups" className='d-flex justify-content-center'>
              <ButtonGroup size='sm' className='mt-1'>
                <Button variant={props.darkmode? "outline-secondary" : "outline-dark"} onClick={handleClickFolder} disabled={(profile.enableGravatar || !profile.allowCookies)} className='border-0 rounded-0'><i className='bi bi-upload' /> File</Button>
                <Button variant={props.darkmode? "outline-secondary" : "outline-dark"} onClick={handleClickDelete} disabled={(profile.enableGravatar || !profile.allowCookies)} className='border-0 rounded-0'><i className='bi bi-x-circle' /> Delete</Button>
              </ButtonGroup>
            </ButtonToolbar>
            <Form.Control onChange={onFileChange} required type="file" ref={fileInput} multiple={false} accept="image/png, image/webp, image/svg+xml, image/jpeg, image/gif" className='d-none' />
          </Col>
          <Col sm={8}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  ref={refName}
                  type="text"
                  placeholder="Name"
                  defaultValue={profile.name || ""}
                  disabled={!profile.allowCookies}
                  autoComplete='given-name' />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  ref={refEmail}
                  type="email"
                  placeholder="email@domain.org"
                  defaultValue={profile.email || ""}
                  disabled={!profile.allowCookies}
                  autoComplete='email' />
              </Form.Group>

              <Form.Label as={'div'}>Settings</Form.Label>
              <Form.Group className="mb-3">
                <Form.Check // prettier-ignore
                  type="switch"
                  id="allow-cookies"
                  label={<>Remember me <small className='text-muted'>(Allow Cookies)</small></>}
                  checked={profile.allowCookies}
                  onChange={handleCookieSwitch}
                  ref={refCookies}
                />
                <Form.Check // prettier-ignore
                  type="switch"
                  id="allow-gravatar"
                  label={<>Use Gravatar <small className='text-muted'>(<a href='https://gravatar.com' target='_blank'>gravatar.com</a>)</small></>}
                  checked={profile.enableGravatar}
                  disabled={!profile.allowCookies}
                  onChange={handleGravatarSwitch}
                  ref={refGravatar}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <span className='form-label mb-2 d-inline-block'>Subset Color Palettes</span>
                <ColorSchemeDropDown refColorScheme={refColorScheme} disabled={!profile.allowCookies} />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="themeSelect">Theme</Form.Label>
                <Form.Select 
                  size="sm"
                  id="themeSelect"
                  ref={refTheme}
                  onChange={handleChangeTheme}
                  value={String(profile.darkmode)}
                >
                  <option value="system">System</option>
                  <option value="false">Light</option>
                  <option value="true">Dark</option>
                </Form.Select>
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
