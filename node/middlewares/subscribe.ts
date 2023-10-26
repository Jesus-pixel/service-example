import {json} from "co-body"
import axios from "axios"

export async function subscribe(ctx: Context, next: () => Promise<any>){
    const body = await json(ctx.req)
    const {email, firstName, phone} = body
    console.log(email, firstName, phone);
    console.log(ctx);

    const http = axios.create({
        headers: {
            VtexIdclientAutCookie: ctx.vtex.authToken,
            "Cache-Control": "no-cache",
            "X-Vtex-Use-Https": true,
        }
    })

    let response = {
        message: "",
        status: 0,
        error: null
    }

    try {
        const userData = {
            "email": email,
            "firstName": firstName,
            "phone": phone
        }

        await http.patch(`http://${ctx.vtex.account}.myvtex.com/api/dataentities/CL/documents/`, userData)

        response = {
            message: "Usuario ha sido registrado con exito",
            status: 200,
            error: null
        }

    } catch (error) {
        response = {
            message: "Error al registrar usuario",
            status: 500,
            error: error
        }
    }

    ctx.status = response.status
    ctx.body = response
    ctx.set("Cache-Control", "no-cache")

    await next()

}