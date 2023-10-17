import React, {useState, useRef} from 'react';
import Container from 'react-bootstrap/Container';
import RegistrationForm from '../components/forms/RegistrationForm';
import LoginForm from '../components/forms/LoginForm';
import useIsMobile from '../hooks/isMobile';

const Registration = () => {
  const [login, setLogin] = useState(false);
  const block1 = useRef();
  const block2 = useRef();
  const text1 = useRef();
  const text2 = useRef();
  const isMobileLG = useIsMobile('991px');

  const optionsTiming = {
    duration: 1000,
    easing: "ease-in-out",
    iterations: 1,
    fill: "forwards",
  };

  const handleClick = () => {
    if(login) {
      block1.current.animate({
        width: ["38%", "60%", "38%"], 
        right: ["62%", "0%"], 
        backgroundPosition: ["0% 100%, 0% 50%", "100% 100%, 100% 50%"],
      }, optionsTiming);
      block2.current.animate({
        marginLeft: ["38%", "0%"]
      }, optionsTiming);
      text1.current.animate({
        marginLeft: ["100%", "0%"]
      }, optionsTiming);
      text2.current.animate({
        left: ["0%", "-100%"]
      }, optionsTiming);
    } else {
      block1.current.animate({
        width: ["38%", "60%", "38%"], 
        right: ["0%", "62%"], 
        backgroundPosition: ["100% 100%, 100% 50%", "0% 100%, 0% 50%"],
      }, optionsTiming);
      block2.current.animate({
        marginLeft: ["0%", "38%"]
      }, optionsTiming);
      text1.current.animate({
        marginLeft: ["0%", "100%"]
      }, optionsTiming);
      text2.current.animate({
        left: ["-100%", "0%"]
      }, optionsTiming);
    }
    // setLogin(!login);
    setTimeout(() => setLogin(!login), 500);
  }

  return (
    <main className='py-lg-0'>
      <Container>
        {
          (isMobileLG)
          ? <section className='login-mobile'>
            {
              (login)
              ? <>
                <LoginForm/>
                <button type='button' onClick={()=>setLogin(false)} className='main-color fs-13 mx-auto mt-4 text-decoration-underline'>Зарегистрироваться</button>
              </>
              : <>
                <RegistrationForm/>
                <button type='button' onClick={()=>setLogin(true)} className='main-color fs-13 mx-auto mt-4 text-decoration-underline'>Войти</button>
              </>
            }
          </section>
          : <section className='login'>
            <div ref={block2} className="login-forms">
              {
                (login)
                ? <LoginForm/>
                : <RegistrationForm/>
              }
            </div>
            <div ref={block1} className="login-toggler">
              <div className="text">
                <div ref={text1} className="text-1">
                  <h4>Уже есть аккаунт?</h4>
                  <p>Войди в личный кабинет</p>
                </div>
                <div ref={text2} className="text-2">
                  <h4>Это ваш первый заказ?</h4>
                  <p>Пройдите регистрацию</p>
                </div>
              </div>
              <button type='button' onClick={handleClick} className='btn-light rounded-3 mx-auto mt-4'>
                {
                  (login)
                  ? <span>Регистрация</span>
                  : <span>Войти</span>
                }
              </button>
            </div>
          </section>
        }
      </Container>
    </main>
  );
};

export default Registration;