---
layout: reference
title: Processes
subhead: Platform Agnostic OS-Level Threads
---

{{#markdown}}
{{{{raw}}}}

C&S presents a novel way to execute independent system processes inspired in large part by Erlang, a language built and known for its amazing concurrency models. Unfortunately, C&S can't be exactly like Erlang because it is really just JavaScript. So if you are familiar with Erlang processes, you should know that C&S processes are actual, OS-level processes, not tiny, dynamic, super-duper efficient Erlang processes.

But even if this isn't Erlang, it's still pretty cool. C&S makes use of the `Worker` API if it detects a browser environment and the `child_process` API if it detects a Node.js environment. In either case, the techniques _you'll use_ to interact with these processes are exactly the same. One API to rule them all, as it were.

## What is a process?

In JavaScript, your code is traditionally executed line by line. If you have a really intense calculation being executed (for example, calculating the factorial of 100), the rest of your application will have to wait until that calculation finishes before it can run. That's the "synchronous" way.

Enter asynchronous JavaScript. A great example of this would be a typical AJAX call making use of a callback function. The AJAX request gets fired off and your program continues working while the request is out. When the request comes back, your callback function gets added to the JavaScript queue. Once the current application flow is "done", JavaScript checks the queue, finds that your callback is waiting to run with the result of the AJAX call, and executes it.

All of this happens inside a single operating system process.

So theoretically, if you could control **two concurrent processes**, you could tell one process to calculate the factorial of 100 and have it send the result back to the other process when it finishes. This way, the other process wouldn't be blocked by the calculation and you could use asynchronous code (like AJAX callbacks) to handle messages being passed between processes.

And this is what Cream & Sugar processes are for.

## How does it work?

In order to handle concurrent processes, you need a few basic tools, namely...

1. The ability to spawn a process.
2. The ability to send messages to a process.
3. The ability to receive messages from a process.
4. The ability to terminate a process.

```
# Create a function that spawns a process
up _ =>

  # Spawn a process from a function.
  spawn fn =>

    # Define a function for calculating factorials
    factorial 0 => 1
    factorial n => n * factorial n - 1

    # Determine what to do with incoming messages
    receive match

      # Calculate factorials if we get a good msg
      {{ FACTORIAL, num }} =>
        reply {{ OK, factorial num }}

      # Send back an error if we get a bad msg
      _ =>
        reply {{ ERR, 'unknown command' }}
```

In C&S, all processes are spawned from functions. This example shows a basic process creator. The `up` function calls `spawn`, which returns a process generated from its argument function. Within the process, we have a function for calculating factorials and a `receive` statement that allows us to pattern match against incoming messages.

Whenever a message comes in, we'll analyze its pattern and see if we can use it. In this case, we expect our message to take the form of a tuple wherein the first item is the atom `FACTORIAL` and the second item is the number to calculate a factorial for. When we get a message like this, we'll `reply` back to the parent thread with another tuple wherein the first item is the atom `OK` and the second item is the calculated factorial. If we receive any other kind of message, we'll reply back indicating that we got an error.

Now that we have a process creator, let's take a look at how we might actually use it.

<br/>
<br/>
<br/>
<br/>

```
# Create the process and grab a reference to it.
myprocess = up _

# When we receive a message, pattern match it to
# figure out what to do.
receive match

  # If the message is marked as ~ok, do whatever
  # we need to with it.
  {{ OK, msg }} =>
    log 'The message was', msg

  # If the message came with an error, kill the
  # process and throw an error.
  {{ ERR, errText, }} =>
    kill myprocess
    throw (create Error, errText)


# Kick things off by telling the process to
# calculate a factorial.
send myprocess, {{ FACTORIAL, 10 }}
```

We'll begin by spinning up our process and and assigning it to a variable. Next, we'll create another `receive` block for determining what to do when our process sends us a message. If we get an `OK` tuple, we'll log the message we got to the console. If we get an `ERR` tuple, we'll use `kill` to kill the process and throw an error.

With everything prepped and ready to go, we'll kick things off by using `send` to pass a message to our process.

Within this example we can see all 4 tools in action. We can create a process with `spawn`. We can handle incoming messages with `receive`. We can send messages to a child process with `send` and reply back to a parent process with `reply`. Lastly, we can terminate a process with `kill`. And regardless of whether we're in Node.js or the browser, all of this functionality works the same way.

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

{{{{/raw}}}}
{{/markdown}}
