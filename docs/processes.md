# Cream & Sugar Processes

CnS presents a novel way to execute independent system processes inspired in large part by Erlang, a language built and known for it's amazing concurrency models. Unfortunately, CnS can't be exactly like Erlang because it is really just JavaScript. So if you are familiar with Erlang processes, you should know that CnS processes are actual, OS-level processes, not tiny, dynamic, super-duper efficient Erlang processes.

But even if this isn't Erlang, it's still pretty cool. CnS makes use of the `Worker` API if it detects a browser environment and the `child_process` API if it detects a Node.js environment. In either case, the techniques _you'll use_ to interact with these processes are exactly the same. One API to rule them all, as it were.

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

In CnS, all processes are spawned from functions. Let's take a look at a basic process module.

```ruby
# factorial-process.cns

# Create a function we can use to spin up a new process.
up ->

  # Create and return a new process from a function.
  spawn fn ->

    # When we receive a message, pattern match it to figure out what to do.
    receive match

      # If the message is an array beginning with the atom ~factorial, we'll
      # calculate the factorial of num and send it back marked as ~ok.
      [~factorial, num] -> reply [~ok, factorial num]

      # If the message is anything else, send a reply marked as `~err` and
      # pass along a reason.
      _ -> reply [~err, 'Unknown command received']
    end

    # Define the factorial function so that we can actually calculate them.
    def
      factorial 0 -> 1
      factorial n -> n * factorial n - 1
    end
  end
end

# Export our process creator function.
export { up/0 }
```

Now that we have a process module, let's take a look at how we might use it within the body of another module.

```ruby
# Import the function that creates a process.
import { up } from './factorial-process'

# Create the process and grab a reference to it.
process = up()

# When we receive a message, pattern match it to figure out what to do.
receive match

  # If the message is marked as ~ok, do whatever we need to with it.
  [~ok, msg] -> doSomethingWith msg

  # If the message came with an error, kill the process and throw an error.
  [~err, errText] ->
    kill process
    throw create(Error, errText)
  end
end

# Kick things off by telling the process to calculate a factorial.
send process, [~factorial, 50]
```

Between these two modules we can see all 4 tools in action. Within `factorial-process.cns` we spawn a new process from a function. Within that process, we pattern match against received messages and also define a factorial function. By convention, we expect that each message coming in will be a 2-item array where the first item is an atom denoting what task should be performed. If we get the `~factorial` atom, we'll run the factorial function on the second part of the message and use `reply` to send it back to the parent thread. If we get something we didn't expect we'll send back an error message.

Within our main process module, we'll import our process creation function and execute it. Next we'll define what to do when our main process receives messages from other processes and then kick things off by sending a message to our child process. If we get back a message marked as `~ok`, we'll do something else with the second part of the message. If we get a message marked as `~err`, it means something went wrong. We'll kill the process and throw an error.

[<- Back to the overview](overview.md)
