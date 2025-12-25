import { render, screen, fireEvent } from "@testing-library/react";
import Transaction from "../Transaction";
import { Expense } from "../../types";

describe("Transaction", () => {
  const mockExpense: Expense = {
    id: 1,
    title: "Grocery Shopping",
    value: 150.5,
    categoryId: 1,
    createdAt: "2024-01-15T10:30:00Z",
  };

  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders transaction card with correct data", () => {
      render(
        <Transaction
          transaction={mockExpense}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByTestId("transaction-card")).toBeInTheDocument();
      expect(screen.getByTestId("transaction-title")).toHaveTextContent(
        "Grocery Shopping"
      );
      expect(screen.getByTestId("transaction-category")).toHaveTextContent(
        "Food"
      );
      expect(screen.getByTestId("transaction-amount")).toBeInTheDocument();
    });

    it("returns null when transaction is null", () => {
      const { container } = render(
        <Transaction
          transaction={null}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("formats positive values with + sign", () => {
      render(
        <Transaction
          transaction={mockExpense}
          categoryName="Income"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByTestId("transaction-amount")).toHaveTextContent(
        "+$150.50"
      );
    });

    it("formats negative values with - sign", () => {
      const negativeExpense: Expense = {
        ...mockExpense,
        value: -75.25,
      };

      render(
        <Transaction
          transaction={negativeExpense}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByTestId("transaction-amount")).toHaveTextContent(
        "-$75.25"
      );
    });

    it("formats date correctly", () => {
      render(
        <Transaction
          transaction={mockExpense}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByTestId("transaction-date")).toHaveTextContent(
        "Jan 15, 2024"
      );
    });

    it("displays N/A when createdAt is missing", () => {
      const expenseWithoutDate: Expense = {
        ...mockExpense,
        createdAt: "",
      };

      render(
        <Transaction
          transaction={expenseWithoutDate}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByTestId("transaction-date")).toHaveTextContent("N/A");
    });

    it("displays 0.00 for invalid value", () => {
      const invalidExpense = {
        ...mockExpense,
        value: NaN,
      } as Expense;

      render(
        <Transaction
          transaction={invalidExpense}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByTestId("transaction-amount")).toHaveTextContent(
        "$0.00"
      );
    });
  });

  describe("Actions", () => {
    it("does not show actions by default", () => {
      render(
        <Transaction
          transaction={mockExpense}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.queryByTestId("transaction-actions")).not.toBeInTheDocument();
      expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
      expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
    });

    it("shows actions when showActions is true", () => {
      render(
        <Transaction
          transaction={mockExpense}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      expect(screen.getByTestId("transaction-actions")).toBeInTheDocument();
      expect(screen.getByTestId("edit-button")).toBeInTheDocument();
      expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    });

    it("calls onEdit with transaction when edit button is clicked", () => {
      render(
        <Transaction
          transaction={mockExpense}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      fireEvent.click(screen.getByTestId("edit-button"));

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockExpense);
    });

    it("calls onDelete with transaction id when delete button is clicked", () => {
      render(
        <Transaction
          transaction={mockExpense}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
          showActions={true}
        />
      );

      fireEvent.click(screen.getByTestId("delete-button"));

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(mockExpense.id);
    });
  });

  describe("Category Colors", () => {
    const categories = [
      "Technology",
      "Science",
      "Health",
      "Sports",
      "Income",
      "Food",
      "Utilities",
      "Entertainment",
      "Transportation",
      "Education",
      "Other",
    ];

    categories.forEach((category) => {
      it(`applies correct styling for ${category} category`, () => {
        render(
          <Transaction
            transaction={mockExpense}
            categoryName={category}
            onDelete={mockOnDelete}
            onEdit={mockOnEdit}
          />
        );

        const categoryElement = screen.getByTestId("transaction-category");
        expect(categoryElement).toHaveTextContent(category);
        expect(categoryElement).toHaveClass("px-3", "py-1", "rounded-full");
      });
    });

    it("applies default styling for unknown category", () => {
      render(
        <Transaction
          transaction={mockExpense}
          categoryName="UnknownCategory"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      const categoryElement = screen.getByTestId("transaction-category");
      expect(categoryElement).toHaveTextContent("UnknownCategory");
    });
  });

  describe("Value Styling", () => {
    it("applies emerald color for positive values", () => {
      render(
        <Transaction
          transaction={mockExpense}
          categoryName="Income"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByTestId("transaction-amount")).toHaveClass(
        "text-emerald-600"
      );
    });

    it("applies rose color for negative values", () => {
      const negativeExpense: Expense = {
        ...mockExpense,
        value: -50,
      };

      render(
        <Transaction
          transaction={negativeExpense}
          categoryName="Food"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByTestId("transaction-amount")).toHaveClass(
        "text-rose-600"
      );
    });

    it("applies emerald color for zero value", () => {
      const zeroExpense: Expense = {
        ...mockExpense,
        value: 0,
      };

      render(
        <Transaction
          transaction={zeroExpense}
          categoryName="Other"
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByTestId("transaction-amount")).toHaveClass(
        "text-emerald-600"
      );
    });
  });
});