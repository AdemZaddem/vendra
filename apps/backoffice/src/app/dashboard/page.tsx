import { createClient } from "@/utils/supabase/server"

const Page = async() => {
    const supabase = await createClient()
    const {data} = await supabase.auth.getSession()
    console.log(data.session?.access_token);
    
  return (
    <div>
      <p>Check Console</p>
    </div>
  )
}
export default Page