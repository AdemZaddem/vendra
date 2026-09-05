import Link from "next/link"

const Page = () => {
  return (
    <div>
      <p>Landing page comin soon</p>
      <Link href={'/login'}>Login</Link>
      <br />
      <Link href={'/register'}>register</Link>
    </div>
  )
}
export default Page