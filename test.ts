import 'dotenv/config'
import { corsair } from "./corsair"

const main = async () => {
    const res = await corsair.withTenant('dev').gmail.db.threads.list({})
    console.log(res);

}
main()
    .then(() => console.log("done"))
    .catch((e) => console.error(e));