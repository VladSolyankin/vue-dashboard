import { ref, computed, type Ref } from "vue";
import { Chart, registerables, type ChartData } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import type { Project, CommitActivity } from "../types/projects";

// Регистрируем необходимые компоненты
Chart.register(...registerables, annotationPlugin);

export function useCharts(
  projects: Ref<Project[]>,
  commitActivity: Ref<CommitActivity[]>
) {
  const techChart = ref<Chart | null>(null);
  const activityChart = ref<Chart | null>(null);

  const techData = computed<ChartData>(() => {
    const techs = new Map<string, number>();
    projects.value.forEach((project) => {
      project.technologies.forEach((tech) => {
        techs.set(tech, (techs.get(tech) || 0) + 1);
      });
    });
    return {
      labels: Array.from(techs.keys()),
      datasets: [
        {
          data: Array.from(techs.values()),
          backgroundColor: [
            "rgba(79, 70, 229, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(52, 211, 153, 0.8)",
            "rgba(251, 146, 60, 0.8)",
            "rgba(99, 102, 241, 0.8)",
          ],
        },
      ],
    };
  });

  const activityData = computed<ChartData>(() => ({
    labels: commitActivity.value.map((item) => item.date),
    datasets: [
      {
        label: "Коммиты",
        data: commitActivity.value.map((item) => item.commits),
        borderColor: "rgba(79, 70, 229, 1)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }));

  const initCharts = () => {
    // График технологий
    const techCtx = document.getElementById("techChart") as HTMLCanvasElement;
    if (techCtx) {
      const ctx = techCtx.getContext("2d");
      if (ctx) {
        // Создаем градиенты
        const gradients = [
          ctx.createLinearGradient(0, 0, 0, 200),
          ctx.createLinearGradient(0, 0, 0, 200),
        ];

        gradients[0].addColorStop(0, "rgba(79, 70, 229, 0.8)");
        gradients[0].addColorStop(1, "rgba(168, 85, 247, 0.8)");

        gradients[1].addColorStop(0, "rgba(236, 72, 153, 0.8)");
        gradients[1].addColorStop(1, "rgba(52, 211, 153, 0.8)");

        techChart.value = new Chart(techCtx, {
          type: "doughnut",
          data: {
            ...techData.value,
            datasets: [
              {
                ...techData.value.datasets[0],
                backgroundColor: gradients,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  font: {
                    size: 12,
                    family: "'Inter', sans-serif",
                  },
                  padding: 20,
                },
              },
            },
            cutout: "70%",
          },
        });
      }
    }

    // График активности
    const activityCtx = document.getElementById(
      "activityChart"
    ) as HTMLCanvasElement;
    if (activityCtx) {
      activityChart.value = new Chart(activityCtx, {
        type: "line",
        data: activityData.value,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            annotation: {
              annotations: {
                maxLine: {
                  type: "line",
                  yMin: Math.max(
                    ...commitActivity.value.map((item) => item.commits)
                  ),
                  yMax: Math.max(
                    ...commitActivity.value.map((item) => item.commits)
                  ),
                  borderColor: "rgba(236, 72, 153, 0.5)",
                  borderWidth: 2,
                  borderDash: [6, 6],
                  label: {
                    display: true,
                    content: "Максимум",
                    position: "end",
                  },
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }
  };

  return {
    techChart,
    activityChart,
    techData,
    activityData,
    initCharts,
  };
}
