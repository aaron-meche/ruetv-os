<!-- created by Aaron Meche -->
<script>
    import { onMount } from "svelte";
    import { 
        sysobj,
        cmd, error,
        throwError
    } from "$lib/data"
    import Logo from "./Logo.svelte";
    import { goto } from "$app/navigation";
    import Home from "./app/Home.svelte";

    let app, sys,
        autoBoot, isBootable, 
        activeOpenClient
    let currCmdValue = null
    let allowCmdTextInput = true
    let loadProgress = 0

    $: {
        autoBoot = $sysobj.boot.auto
        isBootable = $sysobj.boot.allow
        activeOpenClient = $sysobj.boot.active
    }

    function enterSystemMode(mode) {
        // 1 ==> Client Mode
        if (mode == 1) {
            if (!isBootable) {
                throwError("System is not currently bootable.")
                return
            }
            sysobj.update(obj => {
                obj.boot.active = 1;
                return obj
            })
            sys.style.left = "-100vw"
            sys.style.opacity = "0"
            app.style.left = "0"
            app.style.opacity = "1"
        }
        // 0 ==> System Boot Mode
        else if (mode == 0) {
            sysobj.update(obj => {
                obj.boot.active = 0;
                return obj
            })
            sys.style.left = "0"
            sys.style.opacity = "1"
            app.style.left = "100vw"
            app.style.opacity = "0"
        }
    }

    function runCmdInput(command) {
        let splitWord = command.trim().split(" ")
        let firstWord = splitWord?.[0]
        let secondWord = splitWord?.[1]
        let thirdWord = splitWord?.[2]
        let fourthWord = splitWord?.[3]

        if (firstWord == "boot") {
            enterSystemMode(1)
            return "Boot initiated..."
        }
        else if (firstWord == "sys" || firstWord == "system") {
            if (secondWord == "mode" || secondWord == "setmode") {
                if (thirdWord == "0" || thirdWord == "boot") {
                    enterSystemMode(0)
                    return "System set to mode 0"
                }
                else if (thirdWord == "1" || thirdWord == "client") {
                    enterSystemMode(1)
                    return "System set to mode 1"
                }
            }
            else if (secondWord == "allowboot" || secondWord == "boot.allow") {
                sysobj.update(obj => { obj.boot.allow = 1; return obj })
                return "System Boot Enabled"
            }
            else if (secondWord == "denyboot" || secondWord == "boot.deny") {
                sysobj.update(obj => { obj.boot.allow = 0; return obj })
                return "System Boot Disabled"
            }
        }
        return false
    }

    function updateCommandValue(val) {
        cmd.update(cmd => {
            if (!cmd) cmd = ""
            cmd += val
            currCmdValue += val
            return cmd
        })
    }

    function resetBootScreen() {
        if (allowCmdTextInput) return
        error.update(val => {
            val = null
            return val
        })
        cmd.update(val => {
            val = null
            return val
        })
        allowCmdTextInput = true
    }

    function handleCmdTextInput(code) {
        if (!allowCmdTextInput) {
            resetBootScreen()
        }
        
        if (code[0] == "K") 
            updateCommandValue(code[3].toLowerCase())
        else if (code[0] == "D") 
            updateCommandValue(code[5])
        else if (code == "Period") 
            updateCommandValue(".")
        else if (code == "Space") 
            updateCommandValue(" ")
        else if (code == "Backspace") {
            cmd.update(cmd => {
                if (!cmd) return
                let splitCmd = cmd.split("")
                splitCmd.pop()
                cmd = splitCmd.join("")
                currCmdValue = splitCmd.join("")
                return cmd
            })
        }
        else if (code == "Enter") {
            cmd.update(val => {
                if (!val) return
                allowCmdTextInput = false
                let cmdOutput = runCmdInput(val)
                if (cmdOutput) {
                    val = cmdOutput
                }
                else {
                    val = "Invalid Command"
                }
                setTimeout(resetBootScreen, 1000)
                return val
            })
        }
    }

    function handleKeydown(event) {
        let code = event.code
        // console.log(code)

        if (code == "Backquote") {
            enterSystemMode(!activeOpenClient)
        }
        else if (code == "ControlLeft") {
            resetBootScreen()
        }
        else if (!activeOpenClient) {
            handleCmdTextInput(code)
        }
    }

    // Boot Sequence
    onMount(() => {
        enterSystemMode(0)
        setTimeout(() => { if (autoBoot) enterSystemMode(1) }, 1200)
    })
</script>

<!--  -->

<svelte:window on:keydown={handleKeydown} />

<!-- Boot Screen -->
<div class="boot screen" bind:this={sys}>
    <Logo />
</div>
<!-- Client Screen -->
<div class="client screen" bind:this={app}>
    <Home />
</div>

<!--  -->

<style lang="rue">
    .screen{
        position: fixed;
        height: 100vh;
        width: 100vw;
        transition: opacity 800ms, left 800ms;
        opacity: 0;
    }

    .screen.idle{ 
        left: -100vw;
        background: linear-gradient(to bottom right, rgb(40 40 40), rgb(20 20 20));
    }

    .screen.boot{
        display: grid;
        align-items: center;
        justify-content: center;
    }

    .screen.client{ 
        left: 100vw;
    }

    .progress{
        height: 0.4rem;
        width: 24rem;
        margin-top: 1.8rem;
        background: rgb(40 40 40);
        outline: solid 1pt rgb(80 80 80);
        border-radius: 100vh;
        overflow: hidden;

        .value{
            height: 100%;
            max-width: 100%;
            background: rgb(80 80 80);
            transition: width 600ms cubic-bezier(0.86, 0, 0.07, 1);
        }
    }

</style>