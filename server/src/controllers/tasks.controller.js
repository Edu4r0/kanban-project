import { format, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import Task from "../database/models/task.model.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate(
      "user",
      "-password"
    );
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTaskMetrics = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate(
      "user",
      "-password"
    );
    // total tasks
    const totalTasks = tasks.length;

    // charts
    const chartday = await createDayChart(tasks);
    const chartdayPro = await createDayChartPro(tasks);

    // pending tasks
    const pendingTasks = tasks?.filter(
      (task) => task.status === "in progress"
    ).length;

    // completed tasks
    const completedTasks = tasks.filter(
      (task) => task.status === "done"
    ).length;

    // get 10 recent tasks order by date
    const recentTasks = tasks.slice(0, 10).sort((a, b) => b.date - a.date);

    const abandonedTasks = tasks.filter(
      (task) => task.status === "canceled"
    ).length;

    const average = getAverageTasksPerDay(tasks);
    const productivity =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const data = {
      tasks: {
        data: {
          value: totalTasks,
          charts: {
            "chart-days": chartday,
            "chart-day-prooductivity": chartdayPro,
          },
          recentTasks,
        },
        pending: {
          value: pendingTasks,
        },
        completed: {
          value: completedTasks,
        },
        canceled: {
          value: abandonedTasks,
        },
        analitycs: {
          average,
          productivity,
        },
      },
    };

    res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, date, status } = req.body;
    const newTask = new Task({
      title,
      description,
      date,
      status,
      user: req.user.id,
    });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, date, status } = req.body;
    const taskUpdated = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { title, description, status, date },
      { new: true }
    );
    return res.json(taskUpdated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export async function createDayChart(tasks) {
  const last5Months = [];
  let currentMonth = new Date();

  for (let i = 0; i < 5; i++) {
    last5Months.push(format(currentMonth, "MMMM", { locale: es }));
    currentMonth = subMonths(currentMonth, 1);
  }

  // Reducir los documentos por mes
  const data = tasks.reduce((acc, doc) => {
    const month = format(doc.createdAt, "MMMM", { locale: es });
    if (last5Months.includes(month)) {
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
    }
    return acc;
  }, {});
  return last5Months.map((month) => ({
    month,
    tasks: data[month] ?? 0,
  }));
}

export async function createDayChartPro(tasks) {
  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Contar las tareas por día de la semana
  const data = tasks.reduce((acc, task) => {
    const dayOfWeek = new Date(task.date).getDay();
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = 0;
    }
    acc[dayOfWeek]++;
    return acc;
  }, {});

  // Mapear el resultado a un formato adecuado para el gráfico
  return daysOfWeek.map((day, index) => ({
    day,
    tasks: data[index] ?? 0,
  }));
}

const getAverageTasksPerDay = (tasks) => {
  const uniqueDates = new Set(
    tasks.map((task) => new Date(task.date).toISOString().split("T")[0])
  );

  const totalTasks = tasks.length;

  const uniqueDays = uniqueDates.size;

  const averageTasksPerDay = totalTasks / uniqueDays;

  return averageTasksPerDay;
};

