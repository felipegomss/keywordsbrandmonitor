/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import processApiData from "@/utils/data";
import { Goals } from "@/types";

export default function ConfigurationPage() {
  const [goals, setGoals] = useState<Goals>({
    _id: "",
    clicksGoal: 0,
    impressionsGoal: 0,
    ctrGoal: 0,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setGoals({
      ...goals,
      [name]: parseFloat(value),
    });
  };

  axios.interceptors.request.use((config) => {
    if (config.method === "post") {
      delete config.data._id;
    }
    return config;
  });

  // Resto do código do seu componente
  const handleSubmit = async () => {
    const { _id, ...goalData } = goals; // Remova o campo '_id' antes de enviar os dados
    try {
      await axios.post("http://localhost:8080/api/goals", goalData); // Envie apenas os dados (sem '_id')
      alert("Metas atualizadas com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar metas.");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const processedData = await processApiData();
      setGoals(processedData.goalsData);
    };
    fetchData();
    // console.log(goals);
  }, []);

  return (
    <div className="w-full p-8">
      <Card>
        <CardContent>
          <Typography variant="h6">Configuração de Metas</Typography>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <TextField
                label="Cliques (Meta)"
                type="number"
                variant="outlined"
                fullWidth
                name="clicksGoal"
                value={goals.clicksGoal}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <TextField
                label="Impressões (Meta)"
                type="number"
                variant="outlined"
                fullWidth
                name="impressionsGoal"
                value={goals.impressionsGoal}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <TextField
                label="CTR (Meta)"
                type="number"
                variant="outlined"
                fullWidth
                name="ctrGoal"
                value={goals.ctrGoal}
                onChange={handleChange}
              />
            </div>
            <Button variant="outlined" color="primary" type="submit">
              Atualizar Metas
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
