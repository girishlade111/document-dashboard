import { DocumentsTable } from "./documents-table"
import { DocumentCards } from "./document-cards"
import { UserSummaryCard } from "./user-summary-card"
import { AIChatbotWidget } from "./ai-chatbot-widget"

export function DashboardContent() {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-4 lg:p-8 h-full">
        {/* Main Content - Responsive Layout */}
        <div className="h-[calc(100%-2rem)] lg:h-[calc(100%-2rem)]">
          {/* Mobile and Tablet: Vertical Stack */}
          <div className="xl:hidden space-y-6 lg:space-y-8 h-full overflow-y-auto">
            {/* Documents Table - Full width on top */}
            <div className="flex-shrink-0">
              <DocumentsTable />
            </div>

            {/* Bottom Section for tablet/mobile */}
            <div className="grid grid-cols-1 gap-6 lg:gap-8 flex-shrink-0">
              {/* Recent Uploads */}
              <div>
                <DocumentCards />
              </div>

              {/* Profile and AI Assistant - Side by side on tablet, stacked on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <UserSummaryCard />
                <AIChatbotWidget />
              </div>
            </div>
          </div>

          {/* Desktop: Horizontal Split */}
          <div className="hidden xl:grid xl:grid-cols-2 xl:gap-8 h-full">
            {/* Left Half - Documents Table */}
            <div className="flex flex-col min-h-0 h-full">
              <DocumentsTable />
            </div>

            {/* Right Half - Other Sections */}
            <div className="flex flex-col h-full min-h-0">
              {/* Recent Uploads - Fixed height section */}
              <div className="flex-1 min-h-0 mb-6">
                <div className="h-full overflow-y-auto">
                  <DocumentCards />
                </div>
              </div>

              {/* Bottom Row - Profile and AI Assistant - Fixed height */}
              <div className="flex-shrink-0 h-48">
                <div className="grid grid-cols-2 gap-6 h-full">
                  <div className="h-full">
                    <UserSummaryCard />
                  </div>
                  <div className="h-full">
                    <AIChatbotWidget />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
