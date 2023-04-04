import math
from typing import List
import numpy as np

class SimpleTSP:
    def __init__(self, distance_matrix: List[List]):
        total_pois = len(distance_matrix)
        self.mDistanceMatrix = distance_matrix
        self.mVisitedCities = [False for _ in range(total_pois)]
        self.mCurrentPath = [0 for _ in range(total_pois)]
        self.mBestPath = []
        self.mBestPathCosts = float("inf")
        
    
    def runTSP(self, pStartAndEndTownIndex: int) -> float:
        self.mStartAndEndTownIndex = pStartAndEndTownIndex
        for i in range(len(self.mVisitedCities)):
            self.mVisitedCities[i] = False
        self.mVisitedCities[pStartAndEndTownIndex] = True
        self.mCurrentPath[0] = pStartAndEndTownIndex
        self.mBestPathCosts = float("inf")
        self.TSP(pStartAndEndTownIndex, 1, 0)
        return self.mBestPathCosts
    
    def TSP(self, pCurrentCity: int, pCityCounter: int, pCurrentTotalCost: float) -> float:
        if pCityCounter >= len(self.mVisitedCities):
            distanceToStartTown = self.mDistanceMatrix[pCurrentCity][self.mStartAndEndTownIndex]
            if distanceToStartTown > 0:
                return pCurrentTotalCost + distanceToStartTown
            
        localResult = float("inf")
        for i in range(len(self.mVisitedCities)):
            if not self.mVisitedCities[i] and pCurrentCity != i:
                self.mVisitedCities[i] = True
                self.mCurrentPath[pCityCounter] = i
                localResult = self.TSP(i, pCityCounter + 1, pCurrentTotalCost + self.mDistanceMatrix[pCurrentCity][i])
                self.mVisitedCities[i] = False
                if localResult < self.mBestPathCosts:
                    self.mBestPathCosts = localResult
                    self.mBestPath = self.mCurrentPath.copy()
        return localResult
    
    def printBestPath(self):
        print(f"Best path: ({self.mBestPathCosts} costs): ", end="")
        for i in self.mBestPath:
            print(f"{i} -> ", end="")
        print(self.mStartAndEndTownIndex)
    
    def getBestPath(self) -> List[int]:
        return self.mBestPath
    
    def getBestPathCosts(self) -> float:
        return self.mBestPathCosts

