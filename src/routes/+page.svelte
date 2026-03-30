<!-- created by Aaron Meche -->
<script>
    import { onMount } from "svelte";
    import { 
        sysobj,
        cmd, error, result,
        throwError, throwResult,
        startClock
    } from "$lib/data"
    import { goto } from "$app/navigation";
    import Clock from "$lib/components/Clock.svelte";
    import Boot from "./Boot.svelte";
    import App from "./App.svelte";

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
            sys.style.left = "-100vw"
            sys.style.opacity = "0"
            app.style.left = "0"
            app.style.opacity = "1"
            sysobj.update(obj => {
                obj.boot.active = 1;
                return obj
            })
        }
        // 0 ==> System Boot Mode
        else if (mode == 0) {
            sys.style.left = "0"
            sys.style.opacity = "1"
            app.style.left = "100vw"
            app.style.opacity = "0"
            sysobj.update(obj => {
                obj.boot.active = 0;
                return obj
            })
        }
        return 1
    }

    function runCmdInput(command) {
        let splitWord = command.trim().split(" ")

        const commandTree = {
            "boot": () => {
                if (activeOpenClient) return "System is already booted!"
                if (enterSystemMode(1)) return "System booting..."
                return "System Boot: Disabled"
            },
            "sys": {
                "boot": {
                    "allow": () => {
                        if (isBootable) return "System Boot is already Allowed"
                        sysobj.update(obj => { obj.boot.allow = 1; return obj })
                        return "System Boot Enabled"
                    },
                    "deny": () => {
                        if (!isBootable) return "System Boot is already Disabled"
                        sysobj.update(obj => { obj.boot.allow = 0; return obj })
                        return "System Boot Disabled" 
                    },
                    "enable": () => { return runCmdInput("sys boot allow") },
                    "disable": () => { return runCmdInput("sys boot deny") },
                },
                "mode": {
                    "0": () => {
                        if (!activeOpenClient) return "System mode is already set to 0"
                        if (enterSystemMode(0)) return "System mode set to 0"
                    },
                    "1": () => {
                        if (activeOpenClient) return "System mode is already set to 1"
                        if (enterSystemMode(1)) return "System mode set to 1"
                    },
                    "boot": () => { return runCmdInput("sys mode 0") },
                    "app": () => { return runCmdInput("sys mode 1") },
                },
            },
            "clear": () => {
                return "Cleared"
            },
            "restart": () => {
                window.location.reload()
                return "Reloading Client..."
            },
            "reload": () => {
                return commandTree.restart()
            }
        }

        let root = commandTree
        for (let i = 0; i < splitWord.length; i++) {
            root = root?.[splitWord[i]]
            if (!root) return false
        }
        if (root)   return root()
        else        return false
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
        // if (allowCmdTextInput) return
        result.update(val => {
            val = null
            return val
        })
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

    function handleTextInput(event) {
        let code = event.code
        let key = event.key
        if (!allowCmdTextInput) resetBootScreen()
        
        if (code == "Backspace") {
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
                if (cmdOutput) 
                    throwResult(cmdOutput)
                else 
                    throwError("Invalid Command")
                setTimeout(resetBootScreen, 1000)
                return val
            })
        }
        else if (key.length > 1) {
            return
        }
        else {
            updateCommandValue(key)
        }
    }

    function handleKeydown(event) {
        let code = event.code

        if (code == "Backquote") {
            enterSystemMode(!activeOpenClient)
        }
        else if (event.code == "ControlLeft") {
            console.log("clear")
            resetBootScreen()
        }
        else {
            handleTextInput(event)
        }
    }

    let currTime = ""

    // Boot Sequence
    onMount(() => {
        startClock()
        setTimeout(() => { enterSystemMode(0) }, 500)
        setTimeout(() => { if (autoBoot) enterSystemMode(1) }, 2000)
    })
</script>

<!--  -->

<svelte:window on:keydown={handleKeydown} />

<!-- Boot Screen -->
<div class="boot screen" bind:this={sys}>
    <Boot />
</div>
<!-- Client Screen -->
<div class="client screen" bind:this={app}>
    <App />
</div>

<!--  -->

<style lang="rue">
    .screen{
        position: fixed;
        height: 100vh;
        width: 100vw;
        transition: opacity 750ms, left 750ms;
        opacity: 0;
    }

    .screen.boot{
        display: grid;
        align-items: center;
        justify-content: center;
    }

    .screen.client{ 
        left: 100vw;
    }

</style>