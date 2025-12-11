export default function App({ children }: { children: React.ReactNode }) {

  return (
    <div>
      <div>Main page</div>
      <a href="/login">Login</a><br/>
      <a href="/register">Register</a><br/>
      <a href="/boardgames">Board Games</a><br/>
      <a href="/game-sessions">Game Sessions</a><br/>
      <hr/>
      {children}
    </div>
  )
}