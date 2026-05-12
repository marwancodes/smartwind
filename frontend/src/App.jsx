
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';

function App() {

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
