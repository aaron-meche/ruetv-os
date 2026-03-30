<!-- created by Aaron Meche -->
<script>
    import { onMount } from "svelte";
    import { time, date, result, error, cmd } from "$lib/data"

    let notifs = []
    let timeString = null
    let dateString = null
    let currResult = null
    let currError = null
    let currCmd = null
    time.subscribe(val => {
        timeString = val
    })    
    date.subscribe(val => {
        dateString = val
    })
    result.subscribe(err => {
        currResult = err
    })
    error.subscribe(err => {
        currError = err
    })
    cmd.subscribe(val => {
        currCmd = val
    })
</script>

<!--  -->

<div class="app"> 
    <div class="top module">
        <div class="time">{timeString}</div>
        <div class="date">{dateString}</div>
    </div>

    <div class="bottom module">
        <div class="notif-stack">
            {#if currError}
                {#each currError as err}
                    <div class="error notif">
                        {err}
                    </div>
                {/each}
            {/if}
            {#if currResult}
                {#each currResult as result}
                    <div class="result notif">
                        {result}
                    </div>
                {/each}
            {/if}
            {#if currCmd}
                <div class="notif">
                    {currCmd}
                </div>
            {/if}

        </div>
    </div>
</div>

<!--  -->

<style lang="rue">
    .app{
        position: relative;
        height: 100%;
        width: 100%;
        background: url('WP_Castle.jpeg') no-repeat;
        background-size: cover;
    }

    .module{
        position: absolute;
        width: 100vw;
        padding-block: 2.4rem;
        color: white;
        text-align: center;
    }

    .top.module{
        top: 0;

        .time{
            font-size: 8.4rem;
            font-weight: 700;
        }

        .date{
            font-size: 2.4rem;
            font-weight: 500;
        }
    }

    .bottom.module{
        position: fixed;
        bottom: 0;

        .notif-stack{
            display: grid;
            gap: 1.2rem;

            .result.notif{ font-weight: 600; box-shadow: inset 0 0 0.8rem rgb(0, 0, 0, 0.5); }
            .error.notif{ font-weight: 500; box-shadow: inset 0 0 0.8rem rgb(255, 0, 0, 0.5); color: var(--warning) }
            .notif{
                width: fit-content;
                margin: auto;
                padding: 0.8rem 1.6rem;
                color: black;
                background: rgb(255, 255, 255, 0.75);
                backdrop-filter: blur(12pt);
                --webkit-backdrop-filter: blur(12pt);
                border-radius: 100vh;
            }
        }
    }
</style>