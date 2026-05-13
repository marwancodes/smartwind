
import { Show, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/react';
import PageLoader from './components/PageLoader';

function App() {

  const { isLoaded } = useAuth();


  if(!isLoaded) return <PageLoader />;

  return (
    <>  
      <header>
        <Show when="signed-out">
          <SignInButton mode='modal'/>
          <SignUpButton mode='modal'/>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>

      <button className='btn btn-primary'>Sign In</button>
      
    </>
  )
}

export default App;
