import type { Question } from "../../data/types";
import fig1_2025 from "./assets/Figure 1 2025.png?w=400;800;1200&format=avif;webp;png&as=picture";
import fig1_2024 from "./assets/Figure 1 Exam 2024.png?w=400;800;1200&format=avif;webp;png&as=picture";
import fig2_2024 from "./assets/Figure 2 Exam 2024.png?w=400;800;1200&format=avif;webp;png&as=picture";
import fig3_2024 from "./assets/Figure 3 Exam 2024.png?w=400;800;1200&format=avif;webp;png&as=picture";
import fig4_2024 from "./assets/Figure 4 Exam 2024.png?w=400;800;1200&format=avif;webp;png&as=picture";
import fig5_4_2025 from "./assets/Figure 5.4 2025.png?w=400;800;1200&format=avif;webp;png&as=picture";

export const questions: Question[] = [
  {
    id: "2024_q1a",
    exam: "2024",
    topic: "kNN",
    type: "text",
    points: 3,
    repeated: true,
    question:
      "Present a detailed algorithm for how to classify an arbitrary data point (x, y) using kNN classification. Assume binary classification (0 or 1) and Euclidean distance.",
    correctAnswer: `1. Compute Euclidean distance from (x, y) to every training point
2. Sort distances in ascending order
3. Select the k nearest neighbors
4. Count how many belong to class 0 and class 1
5. Assign the majority class to (x, y)
6. In case of a tie, break arbitrarily or use distance weighting`,
    explanation:
      "kNN is a lazy, instance-based algorithm. The key steps are computing distances, sorting, selecting k neighbors, and majority voting.",
  },
  {
    id: "2024_q1b",
    exam: "2024",
    topic: "kNN",
    type: "text",
    points: 3,
    question:
      "Given the regression data in Figure 1, sketch the regression plot for kNN with k=3. Describe how the regression estimate is computed.",
    correctAnswer: `The kNN regression estimate at any point x is computed by finding the k=3 nearest training observations along the x-axis, and averaging their target y values: f(x) = (1/3) * sum(y_i) for i in N_3(x).

Looking at the regression data points in Figure 1, they form a symmetric, parabolic curve with a flat bottom in the center:
- Central Region (x between 6 and 8): The three nearest neighbors are (6,1), (7,1), and (8,1). The prediction is exactly y = (1+1+1)/3 = 1.0, creating a flat horizontal floor.
- Boundary Left (x near 1): The three nearest neighbors are (1,5), (2,5), and (3,4). The prediction is exactly y = (5+5+4)/3 = 4.67.
- Boundary Right (x near 13): The three nearest neighbors are (11,4), (12,5), and (13,5). The prediction is exactly y = (4+5+5)/3 = 4.67.

The resulting regression plot is a step-like, piecewise constant function that is symmetric, starting at 4.67 on the boundaries, stepping down progressively (e.g., passing through averages like 4.0, 3.0, 2.0), holding a flat minimum of 1.0 in the center, and stepping back up symmetrically.`,
    explanation:
      "kNN regression at any point averages the target values of the k nearest neighbors. With k=3, the curve is smoother than k=1 but captures local trends.",
    image: fig1_2024,
  },
  {
    id: "2025_q1_1",
    exam: "2025",
    topic: "kNN",
    type: "mc",
    points: 1,
    repeated: true,
    question:
      "Which of the following best describes how KNN works for classification?",
    options: [
      "It builds a decision tree to separate classes",
      "It computes the mean squared error over all features",
      "It finds the k closest training samples to a query point and uses majority voting",
      "It optimizes weights through gradient descent",
      "It clusters data points based on distance",
    ],
    correctAnswer: "c",
    explanation:
      "KNN is a lazy, instance-based learning algorithm. It finds the k nearest neighbors and uses majority voting for classification.",
  },
  {
    id: "2025_q1_2",
    exam: "2025",
    topic: "kNN",
    type: "mc",
    points: 2,
    question: "What is the impact of setting k too low or too high in KNN?",
    options: [
      "Low k leads to high bias, high k leads to overfitting",
      "Low k can lead to noisy predictions, high k may oversmooth decision boundaries",
      "Low k results in high variance, high k reduces training time",
      "k has no impact if the data is normalized",
      "Low k may oversmooth decision boundaries, high k can lead to noisy predictions",
    ],
    correctAnswer: "b",
    explanation:
      "Small k (e.g. k=1) is sensitive to noise/outliers → high variance. Large k averages over many points, smoothing boundaries but increasing bias.",
  },
  {
    id: "2025_q1_3",
    exam: "2025",
    topic: "kNN",
    type: "mc",
    points: 2,
    question:
      "In a highly imbalanced dataset (90% Class A, 10% Class B), what is a reasonable strategy to help KNN?",
    options: [
      "Normalize the dataset",
      "Use Euclidean distance instead of Manhattan",
      "Reduce the number of neighbors k",
      "Increase the number of neighbors k",
      "Use distance-weighted voting",
    ],
    correctAnswer: "e",
    explanation:
      "Distance-weighted voting reduces majority class dominance by giving closer neighbors more influence, even if they are from the minority class.",
  },
  {
    id: "2025_q1_4",
    exam: "2025",
    topic: "kNN",
    type: "mc",
    points: 1,
    question:
      "Which of the following is NOT a potential issue with KNN in real-world applications?",
    options: [
      "It easily handles categorical variables without preprocessing",
      "It requires the model to be retrained for every prediction",
      "It does not scale well with large datasets",
      "It is sensitive to irrelevant features",
      "KNN becomes less interpretable as the number of features increases",
    ],
    correctAnswer: "a",
    explanation:
      "KNN is distance-based and cannot handle categorical variables directly without encoding. All other options correctly identify actual KNN limitations.",
  },
  {
    id: "2024_q2a",
    exam: "2024",
    topic: "Bias-Variance",
    type: "text",
    points: 2,
    question:
      "Explain how model complexity affects bias and variance. Provide an example of a low-complexity model and a high-complexity model.",
    correctAnswer: `Low complexity (e.g. linear regression): High bias, low variance — underfits complex patterns
High complexity (e.g. polynomial with degree 10): Low bias, high variance — overfits noise
As complexity increases: bias decreases, variance increases — this is the bias-variance tradeoff`,
    explanation:
      "Simple models make strong assumptions (high bias, low variance). Complex models are flexible and fit noise (low bias, high variance).",
  },
  {
    id: "2024_q2b",
    exam: "2024",
    topic: "Bias-Variance",
    type: "text",
    points: 2,
    repeated: true,
    question: `Model A (linear regression): training error 2, test error 30. Model B (polynomial): training error 10, test error 15. Analyze and choose.`,
    correctAnswer: `Model A: High variance — large gap between training (2) and test (30) suggests severe overfitting
Model B: Better generalization — smaller gap between training (10) and test (15)
Choose Model B: it generalizes better to unseen data despite higher training error`,
    explanation:
      "Model A memorizes training data but fails on new data (overfitting). Model B has a better bias-variance balance and lower test error.",
  },
  {
    id: "2025_q2_1",
    exam: "2025",
    topic: "Bias-Variance",
    type: "mc",
    points: 1,
    repeated: true,
    question:
      "Model A (Simple): Training error 4.5, Validation 5.0. Model B (Complex): Training error 1.2, Validation 8.0. Which is overfitting?",
    options: [
      "Model A",
      "Model B",
      "Both models",
      "Neither model",
      "Cannot determine without test data",
    ],
    correctAnswer: "b",
    explanation:
      "Model B fits training data well (1.2) but performs poorly on validation (8.0), indicating high variance and overfitting.",
  },
  {
    id: "2025_q2_2",
    exam: "2025",
    topic: "Bias-Variance",
    type: "mc",
    points: 2,
    question:
      "Which type of error is most directly affected by model complexity?",
    options: ["Bias", "Variance", "Noise", "Overfitting", "Sample size"],
    correctAnswer: "b",
    explanation:
      "As model complexity increases, variance typically increases because the model becomes more sensitive to training data.",
  },
  {
    id: "2025_q2_3",
    exam: "2025",
    topic: "Bias-Variance",
    type: "matching",
    points: 3,
    question:
      "Match each concept (A-D) to the statements below: A. High bias, B. High variance, C. Low error, D. Neither bias nor variance",
    correctAnswer: {
      "Model underfits the data": "A",
      "Model's predictions vary drastically with different training samples":
        "B",
      "Model generalizes well to unseen data": "C",
      "Model shows consistently poor performance on both training and validation":
        "A",
      "Model shows large difference between training and validation errors":
        "B",
      "Model fits both training and validation data with low error": "C",
      "Model performs inconsistently across different test sets": "B",
      "Model ignores regularization penalties": "D",
    },
    explanation:
      "High bias = underfitting (consistent poor performance). High variance = sensitivity to data (large train-val gap, inconsistent).",
  },
  {
    id: "2024_q3a",
    exam: "2024",
    topic: "Linear & Logistic Regression",
    type: "text",
    points: 1,
    question:
      "Compare and contrast linear regression and logistic regression in terms of problems and assumptions.",
    correctAnswer: `Linear regression: Predicts continuous values, assumes linear relationship and normally distributed errors, minimizes MSE
Logistic regression: Predicts class probabilities (binary/multiclass), uses sigmoid function, assumes linear decision boundary, maximizes log-likelihood`,
    explanation:
      "Linear regression outputs continuous values. Logistic regression outputs probabilities bounded [0,1] for classification.",
  },
  {
    id: "2024_q3b",
    exam: "2024",
    topic: "Linear & Logistic Regression",
    type: "text",
    points: 2,
    question:
      "In logistic regression, what is the purpose of the log-likelihood function? Describe how it is used in training.",
    correctAnswer: `The log-likelihood function measures how well the model predicts the observed classes. During training:
1. It is the objective function to maximize
2. Gradient ascent (or minimizing negative log-likelihood via gradient descent) is used to find optimal weights
3. It transforms the product of probabilities into a sum for numerical stability`,
    explanation:
      "Log-likelihood converts the product of probabilities (for each sample) into a sum, making optimization numerically easier.",
  },
  {
    id: "2025_q3_1",
    exam: "2025",
    topic: "Linear & Logistic Regression",
    type: "mc",
    points: 2,
    question:
      "A logistic regression spam filter shows 95% accuracy, but most actual spam emails are missed. Which metric is more informative?",
    options: ["Recall", "Precision", "F1-score", "ROC AUC", "Confusion matrix"],
    correctAnswer: "a",
    explanation:
      "Recall focuses on how many actual positives (spam) are correctly identified. Missed spam = false negatives = low recall.",
  },
  {
    id: "2025_q3_2",
    exam: "2025",
    topic: "Linear & Logistic Regression",
    type: "mc",
    points: 2,
    question:
      "A model outputs probability 0.68 for a customer buying. What is a reasonable threshold strategy for promotional emails?",
    options: [
      "Use 0.5 as the universal threshold",
      "Choose the threshold to maximize model training accuracy",
      "Lower the threshold until 100% of users get emails",
      "Use the mean of all predicted probabilities as the threshold",
      "Choose a threshold based on business trade-offs (precision vs. recall)",
    ],
    correctAnswer: "e",
    explanation:
      "Threshold selection depends on business goals. If false positives are costly, use a higher threshold for better precision.",
  },
  {
    id: "2025_q3_3",
    exam: "2025",
    topic: "Linear & Logistic Regression",
    type: "mc",
    points: 2,
    question:
      "Why might logistic regression perform poorly in highly imbalanced binary classification tasks?",
    options: [
      "It assigns random probabilities to all samples",
      "It ignores the cost of false negatives",
      "It cannot output probabilities",
      "It optimizes overall accuracy, which favors the majority class",
      "It always predicts the minority class",
    ],
    correctAnswer: "d",
    explanation:
      "Logistic regression minimizes a loss function not adjusted for imbalance, leading to majority-class bias and high accuracy but poor minority recall.",
  },
  {
    id: "2024_q4a",
    exam: "2024",
    topic: "Model Selection & Regularization",
    type: "text",
    points: 2,
    question:
      "Describe how you would use grid search with cross-validation to select optimal hyperparameters.",
    correctAnswer: `1. Define a grid of hyperparameter values to try
2. For each combination, perform k-fold cross-validation
3. Train on k−1 folds, evaluate on the held-out fold
4. Average the validation scores across all k folds
5. Select the hyperparameter combination with the best average cross-validation score
6. Optionally retrain on the full training set with the optimal hyperparameters`,
    explanation:
      "Grid search + CV systematically explores hyperparameter space while providing unbiased performance estimates.",
  },
  {
    id: "2024_q4b",
    exam: "2024",
    topic: "Model Selection & Regularization",
    type: "text",
    points: 2,
    question:
      "In Lasso Regression, what happens to coefficients of irrelevant features as λ increases? Why?",
    correctAnswer: `As λ increases, coefficients of irrelevant features shrink toward exactly zero. This happens because Lasso uses L1 regularization (sum of absolute weights), which creates a diamond-shaped constraint region. The sharp corners of the L1 ball make it likely that some coefficients hit exactly zero — performing automatic feature selection.`,
    explanation:
      "L1 (Lasso) penalty produces sparse solutions where irrelevant features get zero coefficients, effectively performing feature selection.",
  },
  {
    id: "2025_q4_1",
    exam: "2025",
    topic: "Model Selection & Regularization",
    type: "matching",
    points: 3,
    question:
      "Match concepts to descriptions: A. L1, B. L2, C. Hyperparameter tuning, D. Cross-validation, E. Early stopping, F. Feature selection, G. Bias, H. Variance",
    correctAnswer: {
      "Reduces weights but does not eliminate them entirely": "B",
      "May cause underfitting when too strong": "G",
      "Process to choose values like regularization strength": "C",
      "Stops training when validation error starts increasing": "E",
      "Leads to different models with small data changes": "H",
      "Can shrink coefficients to exactly zero": "A",
      "A strategy to estimate generalization performance": "D",
      "Removes inputs irrelevant to target variable": "F",
    },
    explanation:
      "L1 (Lasso) = sparsity (zero coefs). L2 (Ridge) = shrinkage but not zero. Bias = underfitting. Variance = sensitivity to data.",
  },
  {
    id: "2025_q4_2_ab",
    exam: "2025",
    topic: "Model Selection & Regularization",
    type: "text",
    points: 2,
    question: `The table below shows training and validation performance for four models with increasing regularization. Answer the subquestions below:
(a) Which model shows signs of overfitting? Why? (1p)
(b) Which model would you deploy? Justify your answer. (1p)`,
    table: {
      headers: [
        "Model",
        "Training Accuracy (%)",
        "Validation Accuracy (%)",
        "Num. Non-Zero Weights",
      ],
      rows: [
        ["A", "99.0", "87.0", "35"],
        ["B", "96.5", "89.8", "20"],
        ["C", "94.0", "91.2", "15"],
        ["D", "91.0", "85.0", "7"],
      ],
    },
    correctAnswer: `(a) Model A shows overfitting: very high training accuracy (99.0%) but lower validation accuracy (87.0%), representing a large gap of 12%.
(b) Deploy Model C: it achieves the highest validation accuracy (91.2%) with only 15 non-zero weights — indicating the best generalization performance with reduced complexity.`,
    explanation:
      "Model A overfits (large train-val gap). Model C generalizes best (highest validation accuracy and simpler than A/B).",
  },
  {
    id: "2025_q4_2_c",
    exam: "2025",
    topic: "Model Selection & Regularization",
    type: "mc",
    points: 1,
    question: `Based on the trend in the number of non-zero weights, what effect is increasing regularization having on these models? Choose the best interpretation:`,
    table: {
      headers: [
        "Model",
        "Training Accuracy (%)",
        "Validation Accuracy (%)",
        "Num. Non-Zero Weights",
      ],
      rows: [
        ["A", "99.0", "87.0", "35"],
        ["B", "96.5", "89.8", "20"],
        ["C", "94.0", "91.2", "15"],
        ["D", "91.0", "85.0", "7"],
      ],
    },
    options: [
      "Regularization is increasing both training and validation accuracy",
      "Regularization is shrinking weights and simplifying the model",
      "Regularization is making the models more complex",
      "Regularization has no effect on model sparsity",
      "Regularization is increasing overfitting",
    ],
    correctAnswer: "b",
    explanation:
      "Increasing regularization from Model A to D reduces the number of non-zero weights from 35 down to 7, which shrinks the weights toward zero and simplifies the model.",
  },
  {
    id: "2024_q5a",
    exam: "2024",
    topic: "Neural Networks",
    type: "calculation",
    points: 3,
    question: `Given the neural network with ReLU hidden activations and step-function output:
w1=2, w2=1, w3=1.5, w4=0.5, w5=1, w6=-1.4, b1=-0.5, b2=0.5, b3=0.5
Give examples of inputs (x1,x2) ≠ (0,0) such that the output is 0 and 1 respectively.`,
    correctAnswer: `To find the inputs, we calculate forward through the network using the correct routing from Figure 2:
- Hidden node 1 receives w1 (from x1) and w3 (from x2), with bias b1 = -0.5:
  h1 = max(0, 2*x1 + 1.5*x2 - 0.5)
- Hidden node 2 receives w2 (from x1) and w4 (from x2), with bias b2 = 0.5:
  h2 = max(0, 1*x1 + 0.5*x2 + 0.5)
- Output node receives h1 with w5 = 1, h2 with w6 = -1.4, with bias b3 = 0.5:
  Output = step(1*h1 - 1.4*h2 + 0.5)

1. Example for Output 0: (x1, x2) = (1, 0)
   h1 = max(0, 2(1) + 1.5(0) - 0.5) = 1.5
   h2 = max(0, 1(1) + 0.5(0) + 0.5) = 1.5
   Weighted sum at output = 1(1.5) - 1.4(1.5) + 0.5 = 1.5 - 2.1 + 0.5 = -0.1
   Since -0.1 < 0, Output = step(-0.1) = 0 ✓

2. Example for Output 1: (x1, x2) = (-1, 1)
   h1 = max(0, 2(-1) + 1.5(1) - 0.5) = max(0, -1) = 0
   h2 = max(0, 1(-1) + 0.5(1) + 0.5) = max(0, 0) = 0
   Weighted sum at output = 1(0) - 1.4(0) + 0.5 = 0.5
   Since 0.5 ≥ 0, Output = step(0.5) = 1 ✓`,
    explanation:
      "Work through the network forward. ReLU zeros out negative values. The step output is 1 iff the weighted sum ≥ 0.",
    image: fig2_2024,
  },
  {
    id: "2024_q5b",
    exam: "2024",
    topic: "Neural Networks",
    type: "text",
    points: 2,
    question:
      "Write down the matrices for the transition between input→hidden and hidden→output layers.",
    correctAnswer: `Input to hidden weights W1 (where row 1 corresponds to hidden node 1 and row 2 to hidden node 2):
[2, 1.5]
[1, 0.5]
Bias b1: [-0.5, 0.5]

Hidden to output weights W2:
[1, -1.4]
Bias b2: [0.5]

So:
h = ReLU(W1 · [x1, x2]ᵀ + b1)
y = step(W2 · h + b2)`,
    explanation:
      "W1 is 2×2 (two hidden nodes from two inputs). W2 is 1×2 (one output from two hidden nodes). Include bias vectors.",
    image: fig2_2024,
  },
  {
    id: "2025_q5_1",
    exam: "2025",
    topic: "Neural Networks",
    type: "mc",
    points: 1,
    question: "Why have neural networks recently become highly successful?",
    options: [
      "Because they now use decision trees to enhance predictions",
      "Because the perceptron was proven to be sufficient for all problems",
      "Because neural networks no longer require activation functions",
      "Because of advances in computational power, large datasets, and improved training algorithms",
      "Because neural networks were recently discovered",
    ],
    correctAnswer: "d",
    explanation:
      "The deep learning revolution is driven by GPUs, massive datasets (Big Data), and algorithmic advances (ReLU, batch norm, Adam, etc.).",
  },
  {
    id: "2025_q5_2",
    exam: "2025",
    topic: "Neural Networks",
    type: "mc",
    points: 1,
    question: "What is the role of the activation function in a neuron?",
    options: [
      "It replaces the need for weights and biases",
      "It maps the input to a feature space using decision trees",
      "It introduces non-linearity into the model, allowing the network to learn complex functions",
      "It prevents overfitting by skipping layers",
      "It ensures output always stays within the 0-1 range",
    ],
    correctAnswer: "c",
    explanation:
      "Without non-linear activation, stacking layers just produces a linear transformation. Activation enables learning complex patterns.",
  },
  {
    id: "2025_q5_3",
    exam: "2025",
    topic: "Neural Networks",
    type: "mc",
    points: 2,
    question:
      "What is the main role of backpropagation in training a neural network?",
    options: [
      "To create more hidden layers during training",
      "To minimize the loss function by computing weight gradients",
      "To shuffle the training data and prevent overfitting",
      "To convert predictions into probabilities",
      "To initialize the weights with small random values",
    ],
    correctAnswer: "b",
    explanation:
      "Backpropagation uses the chain rule to compute gradients of the loss w.r.t. each weight, enabling gradient descent optimization.",
  },
  {
    id: "2025_q5_4",
    exam: "2025",
    topic: "Neural Networks",
    type: "text",
    points: 2,
    question:
      "Describe the feedforward neural network shown: number of layers, neurons, type. What makes this model more powerful than a perceptron?",
    correctAnswer: `4 layers: 1 input layer (3 neurons), 2 hidden layers, 1 output layer (2 neurons). Uses sigmoid activation.
More powerful than perceptron because: multiple hidden layers with non-linear activations allow learning hierarchical feature representations. A single perceptron can only learn linearly separable functions.`,
    explanation:
      "Depth + non-linearity = ability to learn complex, hierarchical representations that a perceptron cannot capture.",
    image: fig5_4_2025,
  },
  {
    id: "2024_q6",
    exam: "2024",
    topic: "Decision Trees & Ensembles",
    type: "calculation",
    points: 5,
    question: `Using the Gini impurity formula, calculate purity gain for splits S1 (split based on leaf count ≥ 6.5) and S2 (split based on height ≥ 45) from the plant data below. Which split is preferred based on your calculations?`,
    table: {
      headers: ["Feature / Sample", "1", "2", "3", "4", "5", "6", "7", "8"],
      rows: [
        ["height (cm)", "30", "40", "50", "35", "55", "45", "60", "50"],
        ["leaf count", "5", "8", "7", "5", "4", "6", "9", "7"],
        ["flower color", "R", "W", "B", "R", "W", "B", "W", "W"],
        ["Class", "P", "Q", "Q", "P", "R", "P", "R", "Q"],
      ],
    },
    correctAnswer: `Parent node: 8 samples. Class distribution: P=3, Q=3, R=2
G_parent = 1 - (3/8)² - (3/8)² - (2/8)² = 1 - 0.1406 - 0.1406 - 0.0625 = 0.6563

Split S1 (leaf count ≥ 6.5):
  Left (≥ 6.5): idx 2,3,7,8 → class: [Q,Q,R,Q] = Q=3, R=1, P=0
    G_left = 1 - (1/4)² - (3/4)² = 1 - 0.0625 - 0.5625 = 0.375
  Right (< 6.5): idx 1,4,5,6 → class: [P,P,R,P] = P=3, Q=0, R=1
    G_right = 1 - (3/4)² - (1/4)² = 0.375
  Δ_S1 = 0.6563 - (4/8)·0.375 - (4/8)·0.375 = 0.6563 - 0.375 = 0.2813

Split S2 (height ≥ 45):
  Left (≥ 45): idx 3,5,6,7,8 → class: [Q,R,P,R,Q] = P=1, Q=2, R=2
    G_left = 1 - (1/5)² - (2/5)² - (2/5)² = 1 - 0.04 - 0.16 - 0.16 = 0.64
  Right (< 45): idx 1,2,4 → class: [P,Q,P] = P=2, Q=1, R=0
    G_right = 1 - (2/3)² - (1/3)² = 1 - 0.444 - 0.111 = 0.444
  Δ_S2 = 0.6563 - (5/8)·0.64 - (3/8)·0.444 = 0.6563 - 0.4 - 0.1665 = 0.0898

S1 is preferred (higher purity gain: 0.2813 > 0.0898).`,
    explanation:
      "Higher purity gain means the split better separates classes. S1 produces two nodes with 75% purity each, while S2 is less effective (64% and 56%).",
  },
  {
    id: "2025_q6_1",
    exam: "2025",
    topic: "Decision Trees & Ensembles",
    type: "mc",
    points: 1,
    question:
      "What is the goal of a decision tree's splitting criterion at each internal node?",
    options: [
      "To find the split that creates the largest possible leaf nodes",
      "To randomly divide the dataset for ensemble learning",
      "To maximize entropy in the child nodes",
      "To choose a split that improves class separation (e.g., by reducing impurity)",
      "To minimize the number of features used",
    ],
    correctAnswer: "d",
    explanation:
      "The splitting criterion aims to maximize information gain (or equivalently, minimize impurity) at each node, creating purer child nodes.",
  },
  {
    id: "2025_q6_2",
    exam: "2025",
    topic: "Decision Trees & Ensembles",
    type: "matching",
    points: 3,
    question:
      "Match concepts: A. Entropy, B. Info Gain, C. Gini, D. Bagging, E. Random Forest, F. Boosting, G. Overfitting, H. Pruning",
    correctAnswer: {
      "A metric used to measure node impurity in classification tasks": "C",
      "Combining weak learners sequentially, focusing on hard examples": "F",
      "Measures reduction in impurity from a split": "B",
      "The tendency of deep trees to memorize training data": "G",
      "Reduces complexity by removing less important branches": "H",
      "The average of multiple trees trained on bootstrapped samples": "D",
      "Ensemble that introduces feature randomness during splitting": "E",
      "A measure of uncertainty or disorder in a dataset": "A",
    },
    explanation:
      "Gini/Entropy = impurity measures. Info Gain = impurity reduction. Bagging = bootstrap averaging. Boosting = sequential. Pruning = simplification.",
  },
  {
    id: "2025_q6_3",
    exam: "2025",
    topic: "Decision Trees & Ensembles",
    type: "mc",
    points: 2,
    question:
      "Why does a Random Forest help reduce overfitting compared to a single decision tree?",
    options: [
      "It eliminates deep branches from all trees",
      "It averages predictions from multiple uncorrelated trees, reducing variance",
      "It uses more features per tree to improve accuracy",
      "It trains on smaller datasets to simplify learning",
      "It applies pruning aggressively on each tree",
    ],
    correctAnswer: "b",
    explanation:
      "Random Forest trains diverse trees on bootstrapped samples with random feature subsets. Averaging reduces high variance.",
  },
  {
    id: "2024_q7a",
    exam: "2024",
    topic: "Support Vector Machines",
    type: "text",
    points: 2,
    question:
      "Although the data in Figure 3 is linearly separable, why might a quadratic kernel be preferred?",
    correctAnswer: `A quadratic kernel might be preferred because:
1. It provides a wider margin, improving generalization
2. The linear separator might be thin/vulnerable — even if separable, the margin may be small
3. A curved boundary can capture the natural grouping/symmetry better
4. Outliers or future points might be classified more robustly with a curved boundary`,
    explanation:
      "Even with linear separability, non-linear kernels can provide larger margins and better generalization to unseen data.",
    image: fig3_2024,
  },
  {
    id: "2024_q7b",
    exam: "2024",
    topic: "Support Vector Machines",
    type: "text",
    points: 1,
    repeated: true,
    question:
      "With a quadratic kernel, which datapoints are likely to be support vectors?",
    correctAnswer: `With a quadratic kernel, the decision boundary will be a curved line (e.g., a parabola or ellipse) that separates the bottom-left cluster of squares (class 0) from the surrounding arc of circles (class 1).

The support vectors will be the datapoints closest to this curved decision boundary:
- From circles (Class 1): x3, x4, x5 (which form the inner boundary of the circle group closest to the squares)
- From squares (Class 0): x6, x8, x11 (which form the outer edge of the square group closest to the circles)

Points like x1, x2 (circles) and x9, x10 (squares) are far from the decision boundary and are highly unlikely to be support vectors.`,
    explanation:
      "Support vectors are the points closest to the margin/decision boundary. They define where the boundary is placed.",
    image: fig3_2024,
  },
  {
    id: "2025_q7_1",
    exam: "2025",
    topic: "Support Vector Machines",
    type: "mc",
    points: 1,
    question:
      "How does the SVM regularization parameter C influence bias and variance?",
    options: [
      "A high value increases bias and reduces variance",
      "A low value increases both bias and variance",
      "A high value reduces bias and increases variance",
      "A low value makes the margin tighter",
      "A high value enforces feature selection",
    ],
    correctAnswer: "c",
    explanation:
      "High C = less regularization = complex model = low bias, high variance. Low C = more regularization = simpler, smoother = high bias.",
  },
  {
    id: "2025_q7_2",
    exam: "2025",
    topic: "Support Vector Machines",
    type: "mc",
    points: 1,
    question:
      "What is a disadvantage of kernel-based SVMs in real-world applications?",
    options: [
      "They do not require labeled data",
      "They always require feature scaling",
      "They are highly interpretable and easy to visualize",
      "They are difficult to interpret and computationally expensive",
      "They only work with decision trees",
    ],
    correctAnswer: "d",
    explanation:
      "Kernel SVMs create complex decision boundaries that are hard to explain, and training scales poorly (O(n²) or O(n³) with dataset size).",
  },
  {
    id: "2025_q7_3",
    exam: "2025",
    topic: "Support Vector Machines",
    type: "text",
    points: 2,
    repeated: true,
    question:
      "Explain the role of support vectors in determining the SVM decision boundary.",
    correctAnswer: `Support vectors are the training examples that lie closest to the margin. They directly determine the position and orientation of the decision boundary — all other data points have no influence. Removing a non-support vector does not change the boundary; removing a support vector does.`,
    explanation:
      'SVMs are "sparse" — only support vectors matter for the decision boundary. This is why SVMs generalize well despite using a small subset of data.',
  },
  {
    id: "2025_q7_4",
    exam: "2025",
    topic: "Support Vector Machines",
    type: "text",
    points: 2,
    question: `You trained four SVM models with different kernel settings and hyperparameters. Their performance and characteristics are shown in the table below.
If your goal is to deploy a robust, interpretable, and efficient model in a real-time system, which model would you choose? Justify your decision using the trade-offs in accuracy, support vectors, and training time.`,
    table: {
      headers: [
        "Model",
        "Kernel",
        "Training Acc. (%)",
        "Validation Acc. (%)",
        "Support Vectors",
        "Training Time (s)",
      ],
      rows: [
        ["A", "Polynomial (degree 5)", "98.5", "80.0", "210", "8.2"],
        ["B", "Gaussian kernel", "95.0", "87.5", "190", "5.5"],
        ["C", "Linear", "93.0", "91.0", "130", "2.1"],
        ["D", "Gaussian kernel (high gamma)", "99.8", "78.0", "300", "12.3"],
      ],
    },
    correctAnswer: `Model C (Linear) is recommended for deployment:
- Highest validation accuracy (91%) → best generalization
- Fewest support vectors (130) → fastest prediction time
- Fastest training (2.1s)
- Highest interpretability → linear boundary is explainable
Models A and D clearly overfit (large train-validation gaps). Model B is good but C is better for speed and interpretability.`,
    explanation:
      "For real-time systems, prioritize prediction speed (fewer SVs), interpretability, and robust generalization. Linear SVM excels at all three.",
  },
  {
    id: "2024_q8",
    exam: "2024",
    topic: "Clustering",
    type: "text",
    points: 3,
    question: "Describe three differences between k-means and DBSCAN.",
    correctAnswer: `1. Cluster shape: k-means assumes spherical clusters; DBSCAN can find arbitrary-shaped clusters
2. Number of clusters: k-means requires specifying k upfront; DBSCAN determines clusters automatically from epsilon and minPts
3. Noise handling: k-means assigns every point to a cluster; DBSCAN can identify outliers/noise points
4. Density: k-means is density-unaware; DBSCAN is density-based and works well with varying densities (to some extent)`,
    explanation:
      "k-means is centroid-based and spherical. DBSCAN is density-based, finds arbitrary shapes, and handles noise explicitly.",
  },
  {
    id: "2024_q9a",
    exam: "2024",
    topic: "Clustering",
    type: "calculation",
    points: 3,
    repeated: true,
    question: `Apply hierarchical clustering with complete linkage to the dissimilarity matrix:
   0    1    2    3
0  0.0  0.3  0.4  0.7
1  0.3  0.0  0.5  0.8
2  0.4  0.5  0.0  0.45
3  0.7  0.8  0.45 0.0
Draw the dendrogram and indicate merge heights.`,
    correctAnswer: `Step 1: Find smallest distance = 0.3 (between points 0 and 1). Merge {0,1} at height 0.3.
Step 2: Compute complete linkage distances from {0,1} to others:
  d({0,1}, 2) = max(d(0,2), d(1,2)) = max(0.4, 0.5) = 0.5
  d({0,1}, 3) = max(d(0,3), d(1,3)) = max(0.7, 0.8) = 0.8
Step 3: Smallest distance = 0.45 (between points 2 and 3). Merge {2,3} at height 0.45.
Step 4: d({0,1}, {2,3}) = max(0.5, 0.8) = 0.8. Merge at height 0.8.

Dendrogram:
    ┌─── 0
0.3─┤
    └─── 1                    ┌─── 0
       ┌─── 2                 ├─── 1
0.45──┤              0.8─────┤
       └─── 3                 ├─── 2
                              └─── 3`,
    explanation:
      "Complete linkage uses maximum distance between clusters. This produces compact, tight clusters.",
  },
  {
    id: "2024_q9b",
    exam: "2024",
    topic: "Clustering",
    type: "text",
    points: 1,
    repeated: true,
    question:
      "Extract two clusters from the dendrogram and indicate which points are in each.",
    correctAnswer: `Cut at height between 0.45 and 0.8 (e.g., at 0.6):
Cluster 1: Points 0, 1
Cluster 2: Points 2, 3`,
    explanation:
      "Cutting the dendrogram at an appropriate height splits it into the desired number of clusters.",
  },
  {
    id: "2025_q8a",
    exam: "2025",
    topic: "Clustering",
    type: "calculation",
    points: 3,
    repeated: true,
    question: `Perform agglomerative hierarchical clustering on 15 European capitals using single linkage. The distance matrix has 15 cities. Draw a horizontal dendrogram.`,
    correctAnswer: `Single linkage merges clusters based on the minimum pairwise distance between any of their members.

Step-by-step agglomerative merges from the distance matrix:
1. Merge Amsterdam and Brussels (distance: 209 km - smallest distance in the matrix)
2. Merge Luxembourg into the {Amsterdam, Brussels} cluster (distance to Brussels: 233 km)
3. Merge Paris into the {Amsterdam, Brussels, Luxembourg} cluster (distance to Brussels: 294 km)
4. Merge Prague and Vienna (distance: 312 km)
5. Merge London into the {Amsterdam, Brussels, Luxembourg, Paris} cluster (distance to Brussels: 328 km)
6. Merge Berlin into the {Prague, Vienna} cluster (distance to Prague: 354 km)
7. Merge Bern into the {Amsterdam, Brussels, Luxembourg, Paris, London} cluster (distance to Luxembourg: 429 km)
8. Merge Lisbon and Madrid (distance: 638 km)
9. Merge the two largest clusters via Amsterdam-Berlin (distance: 649 km), forming a super-cluster: {Amsterdam, Brussels, Luxembourg, Paris, London, Bern, Prague, Vienna, Berlin}.
10. Merge Edinburgh into the super-cluster (distance to London: 656 km)
11. Merge Copenhagen into the super-cluster (distance to Berlin: 743 km)
12. Merge Rome into the super-cluster (distance to Bern: 897 km)

Ultimately, geographically peripheral cities like Madrid, Lisbon, Athens, and Edinburgh join the main cluster much later at higher thresholds.`,
    explanation:
      "Single linkage = min distance between clusters. This tends to create elongated, chain-like clusters (chaining effect).",
  },
  {
    id: "2025_q8b",
    exam: "2025",
    topic: "Clustering",
    type: "text",
    points: 1,
    repeated: true,
    question:
      "Split the dendrogram into 3 clusters. Is the new world order balanced?",
    correctAnswer: `If we cut the dendrogram to form 3 clusters, the resulting clusters are:
1. Main European Cluster (12 cities): Amsterdam, Brussels, Luxembourg, Paris, London, Bern, Berlin, Prague, Vienna, Edinburgh, Copenhagen, Rome.
2. Iberian Cluster (2 cities): Lisbon, Madrid (merged at 638 km).
3. Athens (1 city): Remains isolated since its closest neighbor is Vienna at 1886 km.

This is highly unbalanced, with one cluster containing 12 capitals, one containing 2, and one containing only 1. The "new world order" is extremely unbalanced geographically.`,
    explanation:
      "Single linkage with geographic distances reflects the geographic reality: Central Europe is dense, periphery cities are sparse.",
  },
  {
    id: "2025_q8c",
    exam: "2025",
    topic: "Clustering",
    type: "mc",
    points: 1,
    question:
      "Which city is the biggest outlier in the European capitals dataset?",
    options: ["Athens", "Edinburgh", "Lisbon", "Copenhagen", "London"],
    correctAnswer: "a",
    explanation:
      "Athens has the largest average distance to all other capitals, being geographically isolated in southeastern Europe.",
  },
  {
    id: "2024_q10",
    exam: "2024",
    topic: "Dimensionality Reduction",
    type: "text",
    points: 3,
    question:
      "Discuss the pros and cons of two different projections in Figure 4, and when to use one over the other.",
    correctAnswer: `1. Left Projection (Orthogonal projection onto the x-axis):
   - Pros: Preserves the maximum overall variance/spread of the dataset, as the data is horizontally elongated.
   - Cons: The two classes (blue circles and red crosses) overlap heavily, destroying any class separability.

2. Right Projection (Orthogonal projection onto the y-axis):
   - Pros: Achieves perfect linear separation between the two classes (blue circles and red crosses), making it excellent for classification tasks.
   - Cons: Captures very low overall variance, as the vertical spread is much smaller.

Summary of when to use:
- Use the x-axis projection (Left) when doing unsupervised dimensionality reduction (like PCA) where the primary goal is maximizing captured variance regardless of labels.
- Use the y-axis projection (Right) when doing supervised dimensionality reduction (like LDA) or preparing data for a classifier, as class separability is the main priority.`,
    explanation:
      "This highlights the trade-off between maximizing variance (PCA) and maximizing class separability (LDA) when projecting high-dimensional data.",
    image: fig4_2024,
  },
  {
    id: "2025_q9a",
    exam: "2025",
    topic: "Dimensionality Reduction",
    type: "text",
    points: 2,
    question:
      "What are the main differences between PCA and Sammon mapping? Think about the optimization process.",
    correctAnswer: `PCA: Linear, deterministic, maximizes variance in projected space. Solves eigenvalue problem on covariance matrix. Preserves global structure and distances.
Sammon mapping: Non-linear, iterative optimization. Minimizes the difference between pairwise distances in original and reduced space (Sammon stress). Emphasizes preserving small distances (local structure) more than large ones.

Key difference: PCA is variance-maximizing (global), Sammon is distance-preserving (local-focused).`,
    explanation:
      "PCA finds orthogonal directions of max variance via eigendecomposition. Sammon minimizes a stress function via gradient descent, weighting small distances more.",
    image: fig1_2025,
  },
  {
    id: "2025_q9b",
    exam: "2025",
    topic: "Dimensionality Reduction",
    type: "text",
    points: 1,
    question:
      "What is the unique characteristic of Sammon mapping that might make it more attractive than PCA?",
    correctAnswer: `Sammon mapping preserves pairwise distances between points, with higher emphasis on small distances. This makes it better at revealing local structure and clusters that PCA might miss. If your goal is to discover natural groupings in the data, Sammon mapping is more suitable.`,
    explanation:
      "Sammon mapping emphasizes preserving small distances → good for local neighborhood visualization and cluster discovery.",
  },
  {
    id: "2025_q9c",
    exam: "2025",
    topic: "Dimensionality Reduction",
    type: "text",
    points: 1,
    question:
      "Why would an analyst choose complex non-linear DR (Sammon/t-SNE) over simple linear DR (PCA)?",
    correctAnswer: `An analyst would choose non-linear DR when:
1. The data has a non-linear underlying manifold structure
2. The goal is visualization and cluster discovery (local relationships matter more)
3. PCA fails to separate classes/clusters in the reduced space
4. The data layout in the original space is inherently non-linear (e.g., swiss roll)`,
    explanation:
      "Non-linear methods can untangle complex manifolds that linear projections cannot separate.",
  },
];
