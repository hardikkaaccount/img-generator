import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RulebookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="border-2 border-blue-100 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">The Prompt Wars: Rulebook</CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">
              Complete event rules and guidelines
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-blue max-w-none">
            <h2>Event Overview</h2>
            <ul>
              <li>
                <strong>Date:</strong> 8th May, 2025
              </li>
              <li>
                <strong>Venue:</strong> AI & ML Lab
              </li>
              <li>
                <strong>Duration:</strong> 6 Hours
              </li>
              <li>
                <strong>Entry Fee:</strong> ₹200 per team (Online)
              </li>
              <li>
                <strong>Team Size:</strong> 2 members per team
              </li>
            </ul>

            <h2>Description</h2>
            <p>
              "The Prompt Wars" is a creative AI-powered event where teams use provided LLM based website by organizers
              to maintain equality to solve challenges by crafting the most effective prompts. The goal is to emphasize
              creativity, clarity, logic, and communication with AI, instead of traditional coding.
            </p>

            <h2>Round 1: Best Image Generation</h2>
            <h3>What's the task?</h3>
            <p>You and your teammate will be given a theme or a scenario like:</p>
            <ul>
              <li>"A futuristic city at night with red moon …….."</li>
              <li>"A robot helping a child with homework ………"</li>
            </ul>
            <p>
              Participants job is to write the perfect prompt to generate an image using the website provided by the
              organizers.
            </p>

            <h3>What's the goal?</h3>
            <p>
              The goal is to make the AI create the most visually stunning and meaningful image using just your words.
            </p>

            <h3>How will you be judged?</h3>
            <ul>
              <li>Is the image accurate to the given scenario?</li>
              <li>Is your prompt creative and original?</li>
              <li>Is the image unique and eye-catching?</li>
              <li>Number of prompt used.</li>
            </ul>

            <h2>Round 2: Solve It With A Prompt</h2>
            <h3>What's the task?</h3>
            <p>You'll be given coding problems like:</p>
            <ul>
              <li>Solve a recursion problem …..</li>
              <li>Sort an array ….</li>
              <li>Do some pattern matching ….</li>
            </ul>
            <p>
              But instead of coding it yourself, you need to guide the AI (like ChatGPT or another LLM) to solve it for
              you — using just a well-written prompt.
            </p>

            <h3>What's the goal?</h3>
            <p>
              You need to explain the problem clearly to the AI so that it gives you the correct and efficient code.
            </p>

            <h3>How will you be judged?</h3>
            <ul>
              <li>Is your prompt clear and logical?</li>
              <li>Does the AI give the correct solution?</li>
              <li>Does it handle edge cases (like tricky inputs)?</li>
              <li>Is the solution efficient and neat?</li>
              <li>Time and space complexity</li>
            </ul>

            <h2>Round 3: Clone This</h2>
            <h3>What's the task?</h3>
            <p>You'll be told to replicate (clone) a mini web or app — like:</p>
            <ul>
              <li>A calculator</li>
              <li>A simple blog site</li>
              <li>A to-do list app</li>
            </ul>
            <p>
              Again, you won't write code. Instead, you'll prompt the AI to create it for you — including both logic and
              design.
            </p>

            <h3>What's the goal?</h3>
            <p>
              Use your prompt skills to make the AI give you a fully functional and good-looking clone of the app/tool.
            </p>

            <h3>How will you be judged?</h3>
            <ul>
              <li>How complete and accurate is the clone?</li>
              <li>How smart and detailed was your prompt?</li>
              <li>Does the design look good?</li>
              <li>Does it actually work?</li>
            </ul>

            <h2>Final Judging & Results</h2>
            <ul>
              <li>
                Final judges evaluate: Based on all 3 round points, finally top 3 teams will receive 1st, 2nd, 3rd price
                (price pool 10,000)
                <ul>
                  <li>First Price: 5000</li>
                  <li>Second Price: 3000</li>
                  <li>Third Price: 2000</li>
                </ul>
              </li>
              <li>Other than cash prize top teams are awarded with mementos and certificates.</li>
              <li>Participants will receive Participation certificate</li>
            </ul>

            <h2>General Rules</h2>
            <ul>
              <li>Teams must consist of exactly 2 members.</li>
              <li>All participants must bring their college ID cards.</li>
              <li>The decision of the judges will be final and binding.</li>
              <li>
                Use of personal AI tools or websites other than those provided by the organizers is strictly prohibited.
              </li>
              <li>Teams found violating any rules will be disqualified immediately.</li>
              <li>Registration fee is non-refundable.</li>
            </ul>

            <h2>Contact Information</h2>
            <p>For any queries, please contact:</p>
            <ul>
              <li>Email: tachyon@pesce.ac.in</li>
              <li>Phone: +91 9876543210</li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/register">Register Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
