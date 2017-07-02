# surel

This is an app with following configuration:

```txt
  browser -> app <- server-to-server http request -> api <- event -> queue -> sender -> [ service1, service2, service3 ]
                                                                       ^
                                                                       |
                                                                       `-- arena
```

- [app](https://surel-mqdnclstjx.now.sh/)
- [api](https://surel-api-ypwfcjkolq.now.sh/v1/ping)
- [arena](https://bull-arena-pcfeaecyao.now.sh)

A single page `app` (written in [preact](https://github.com/developit/preact)) is served by a [koa](https://github.com/koajs/koa) `app`, talks to `api`. Each request received by `api` then
will be scheduled to a redis-based queue [bull](https://github.com/OptimalBits/bull). Fortunately, there is a monitoring app for bull, i.e. (arena)[https://github.com/mixmaxhq/arena].

The fallback mechanism is controlled by the app rather than automatically handled by the `api` or `queue`. 
By detecting the suggested `next` service.

E.g. for successful attempt of sending mail

![compose](https://cldup.com/aBYileceqA.png)

Gives

![result](https://cldup.com/zEj4-jINXO.png)

And 

![arena](https://cldup.com/SHJnu9zbxC.png)

E.g. for failure, i.e. using mailgun with unknown `to` email, we get

![mailgun](https://cldup.com/KOFHlrrFZH.png)
