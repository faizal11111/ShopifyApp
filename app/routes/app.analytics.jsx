import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Select, Card, Page } from "@shopify/polaris";

export default function AnalyticsPage() {
  // State for form data & selected filter
  const [formData, setFormData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Fetch form responses from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/form-responses"); // Make sure this API exists in your backend!
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    }
    fetchData();
  }, []);

  // Filtered Data for Charts
  const filteredData = selectedFilter === "all"
    ? formData
    : formData.filter((entry) => entry.category === selectedFilter);

  // Extracting Chart Data
  const pieChartData = {
    labels: [...new Set(filteredData.map((entry) => entry.option))],
    datasets: [
      {
        data: filteredData.reduce((acc, entry) => {
          acc[entry.option] = (acc[entry.option] || 0) + 1;
          return acc;
        }, {}),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const barChartData = {
    labels: [...new Set(filteredData.map((entry) => entry.question))],
    datasets: [
      {
        label: "Responses",
        data: filteredData.map((entry) => entry.value),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <Page title="Survey Analytics">
      <Card sectioned>
        <Select
          label="Filter Responses"
          options={[
            { label: "All Responses", value: "all" },
            { label: "Category A", value: "category_a" },
            { label: "Category B", value: "category_b" },
          ]}
          onChange={setSelectedFilter}
          value={selectedFilter}
        />
      </Card>

      <Card sectioned>
        <h2>Response Distribution</h2>
        <Pie data={pieChartData} />
      </Card>

      <Card sectioned>
        <h2>Responses by Question</h2>
        <Bar data={barChartData} />
      </Card>
    </Page>
  );
}
